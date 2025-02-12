import { IMAGE_TEST_URL, TIME_ZONE } from '@constants/post';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Post } from '@schemas/post.schema';
import { Session } from '@schemas/token';
import { User } from '@schemas/user.schema';
import { DefaultPostBodyCreate, PublishedPostProps } from '@type/post';
import { CronJob } from 'cron';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { get } from 'request-promise';

@Injectable()
export class PostService {
	private scheduledPosts: Map<string, CronJob> = new Map();
	private readonly logger = new Logger(PostService.name);

	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Post.name) private readonly postModel: Model<Post>,
		private readonly ig: IgApiClient,
		private readonly instagramAuthService: InstagramAuthService,
		private schedulerRegistry: SchedulerRegistry
	) {}

	async create({ data, meta }: DefaultPostBodyCreate) {
		const { post_date } = data;

		if (post_date) {
			return this.schedulePost({ data, meta });
		}

		return this.publishNow({ data, meta });
	}

	async publishNow({ data, meta }: PublishedPostProps) {
		const { username, caption } = data;

		const account = await this.userModel
			.findOne(
				{
					_id: meta.userId,
					'InstagramAccounts.username': username,
				},
				{
					_id: 0,
					InstagramAccounts: 1,
				}
			)
			.lean()
			.then((user) => user?.InstagramAccounts[0]);

		if (!account) {
			throw new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT');
		}

		try {
			await this.publishPhotoOnInstagram(caption, username, account.session);
		} catch (error) {
			this.logger.error('Failed to publish photo on Instagram', { username, error });
			throw new BadRequestException('FAILED_PUBLISH_POST');
		}

		const post = await this.postModel.create({
			caption,
			imageUrl: IMAGE_TEST_URL,
			userId: account.accountId,
			canceledAt: null,
			publishedAt: new Date(),
			scheduledAt: null,
		});

		return {
			post: {
				caption: post.caption,
				imageUrl: post.imageUrl,
				publishedAt: post.publishedAt,
				id: post._id.toString(),
			},
		};
	}

	async schedulePost({ data, meta }: DefaultPostBodyCreate) {
		const { username, post_date, caption } = data;
		const date = new Date(post_date);

		if (date < new Date()) {
			throw new BadRequestException('INVALID_POST_DATE');
		}

		const instagramAccount = await this.instagramAuthService.hasInstagramAccount(meta, username);

		if (!instagramAccount) {
			throw new NotFoundException('USER_NOT_ASSOCIATED_WITH_THIS_ACCOUNT');
		}

		const restored = await this.instagramAuthService.restoreSession(username, instagramAccount.session);

		if (!restored) {
			throw new TokenExpiredError('SESSION_REQUIRED', new Date());
		}

		const jobId = `post_${username}_${date.getTime()}`;

		const post = await this.postModel.create({
			caption,
			imageUrl: IMAGE_TEST_URL,
			userId: instagramAccount.accountId,
			canceledAt: null,
			publishedAt: null,
			jobId,
			scheduledAt: post_date || null,
		});

		await this.scheduleCronJob(jobId, date, {
			data,
			meta,
			id: post._id.toString(),
			session: instagramAccount.session,
		});

		return {
			scheduled_date: date,
			post_id: post._id.toString(),
		};
	}

	async scheduleCronJob(jobId: string, date: Date, publishParams: PublishedPostProps) {
		const cronExpression = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;

		const job = new CronJob(
			cronExpression,
			async () => {
				this.logger.debug(`Executing scheduled post ${jobId}`);
				try {
					await this.publishPost(publishParams);
				} catch (err) {
					this.logger.error(`Failed to publish scheduled post ${jobId}`, err);
				}
			},
			this.createCleanupHandler(jobId),
			true, // start
			TIME_ZONE
		);

		this.schedulerRegistry.addCronJob(jobId, job);
		this.scheduledPosts.set(jobId, job);
		this.logger.debug(`Post scheduled with ID ${jobId} for ${date}`);
	}

	private createCleanupHandler(jobId: string) {
		return () => {
			this.logger.debug(`Cleaning up job ${jobId}`);
			this.cleanupJob(jobId);
		};
	}

	private cleanupJob(jobId: string) {
		this.scheduledPosts.delete(jobId);
		this.schedulerRegistry.deleteCronJob(jobId);
	}

	async publishPost({ data, meta, id, session }: PublishedPostProps) {
		const { username, caption } = data;

		const user = await this.userModel.findOne({ _id: meta.userId });

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		try {
			await this.publishPhotoOnInstagram(caption, username, session);
		} catch (error) {
			this.logger.error('Failed to publish photo on Instagram', { username, error });
			throw new BadRequestException('FAILED_PUBLISH_POST');
		}

		const updatedPost = await this.postModel.findOneAndUpdate(
			{ _id: id },
			{ publishedAt: new Date() },
			{ new: true }
		);

		if (!updatedPost) {
			throw new NotFoundException('POST_NOT_FOUND');
		}

		this.logger.debug(`Post published successfully ${username}`);
		return {
			post: {
				caption: updatedPost.caption,
				imageUrl: updatedPost.imageUrl,
				publishedAt: updatedPost.publishedAt,
				scheduledAt: updatedPost.scheduledAt,
				id: updatedPost._id.toString(),
			},
		};
	}

	async publishPhotoOnInstagram(caption: string, username: string, session: Session): Promise<boolean> {
		try {
			const restored = await this.instagramAuthService.restoreSession(username, session);

			if (!restored) {
				throw new TokenExpiredError('SESSION_REQUIRED', new Date());
			}

			const imageBuffer = await get({ url: IMAGE_TEST_URL, encoding: null });
			await this.ig.publish.photo({ file: imageBuffer, caption });

			return true;
		} catch (error) {
			this.logger.error('Failed to publish photo on Instagram', { caption, error });
			throw new BadRequestException('FAILED_PUBLISH_PHOTO');
		}
	}

	async cancelScheduledPost({ query, meta }: DefaultPostBodyCreate) {
		const { postId, username } = query;

		const account = await this.userModel
			.findOne(
				{
					_id: meta.userId,
					'InstagramAccounts.username': username,
				},
				{
					_id: 0,
					InstagramAccounts: 1,
				}
			)
			.lean()
			.then((user) => user?.InstagramAccounts[0]);

		const post = await this.postModel
			.findOne(
				{
					_id: postId,
					scheduledAt: { $ne: null },
					userId: account.accountId,
				},
				{ jobId: 1 }
			)
			.lean();

		if (!post) {
			throw new NotFoundException('SCHEDULED_POST_NOT_FOUND');
		}

		const job = this.scheduledPosts.get(post.jobId);

		if (!job) {
			throw new NotFoundException('SCHEDULED_JOB_NOT_FOUND');
		}

		await this.postModel.updateOne(
			{ _id: postId },
			{
				canceledAt: new Date(),
				scheduledAt: null,
			}
		);

		this.cleanupJob(post.jobId);

		return true;
	}
}
