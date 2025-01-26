import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { InstagramAccount } from '@type/instagram-account';
import { Meta } from '@type/meta';
import * as crypto from 'crypto';
import { scrypt } from 'crypto';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { promisify } from 'util';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAccountDocument } from '@schemas/instagram-account.schema';

const scryptAsync = promisify(scrypt);

@Injectable()
export class InstagramAuthService {
	private readonly logger = new Logger(InstagramAuthService.name);

	constructor(
		private readonly ig: IgApiClient,
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	async hasInstagramAccount(meta: Meta, username: string) {
		const user = await this.userModel.findOne({
			_id: meta?.userId,
		});

		if (!user) {
			throw new BadRequestException('User not found');
		}

		const existingAccount = await this.userModel.countDocuments({
			_id: user?._id,
			'InstagramAccounts.username': username,
		});

		if (existingAccount > 0) {
			return true;
		}

		return false;
	}

	async login(body: InstagramAuthDto, meta: Meta) {
		const { username } = body;

		const existingThisAccount = await this.hasInstagramAccount(meta, username);

		if (!existingThisAccount) {
			return this.addAccount(body, meta);
		}

		return this.verifyAccount(body, meta);
	}

	async verifyAccount(body: InstagramAuthDto, meta: Meta) {
		const { password, username } = body;

		const instagramAccount = await this.userModel
			.findOne(
				{
					_id: meta?.userId,
					InstagramAccounts: {
						$elemMatch: {
							username: username,
						},
					},
				},
				{
					InstagramAccounts: 1,
					_id: 0,
				}
			)
			.lean();

		if (!instagramAccount) {
			throw new NotFoundException('Instagram account not found');
		}

		const account: InstagramAccountDocument = instagramAccount?.InstagramAccounts[0] as InstagramAccountDocument;

		const [hashedPassword, salt] = account.password.split('.');

		const hash = (await scryptAsync(password, salt, 32)) as Buffer;

		if (hashedPassword !== hash.toString('hex')) {
			throw new BadRequestException('Invalid credentials');
		}

		return {
			username: account.username,
			fullName: account.fullName,
			biography: account.biography,
			followerCount: account.followerCount,
			followingCount: account.followingCount,
			postCount: account.postCount,
			profilePicUrl: account.profilePicUrl,
			lastLogin: Date.now(),
			id: account?._id.toString(),
		};
	}

	async addAccount(body: InstagramAuthDto, meta: Meta) {
		const { username, password } = body;

		this.ig.state.generateDevice(username);

		try {
			const user = await this.ig.account.login(username, password);

			const userInfo = await this.ig.user.info(user.pk);

			const hashedPassword = await this.generatePasswordHash(password);

			const userData: InstagramAccount = {
				userId: user.pk.toString(),
				username: user.username,
				fullName: userInfo.full_name,
				biography: userInfo.biography,
				followerCount: userInfo.follower_count,
				followingCount: userInfo.following_count,
				postCount: userInfo.media_count,
				profilePicUrl: userInfo.profile_pic_url,
				lastLogin: new Date(),
				password: hashedPassword,
				isPrivate: userInfo.is_private,
				isVerified: userInfo.is_verified,
			};

			const newUser = await this.userModel
				.findOneAndUpdate(
					{ email: meta.email },
					{ $push: { InstagramAccounts: userData } },
					{
						_id: 0,
						new: true,
						select: 'email InstagramAccounts.username InstagramAccounts.userId',
					}
				)
				.lean();

			if (!newUser) {
				throw new BadRequestException('Error adding account');
			}

			return {
				message: 'Login successful',
				newUser,
			};
		} catch (error) {
			this.logger.error(`Login failed for user ${username}:`, error);
			throw new BadRequestException('Invalid Credentials');
		}
	}
	async getAccounts(meta: Meta) {
		const user = await this.userModel.findOne({ _id: meta.userId }, { InstagramAccounts: 1, _id: 0 }).lean();

		const accounts =
			user?.InstagramAccounts?.map((account: InstagramAccount) => ({
				...account,
				id: account._id.toString(),
				_id: undefined,
			})) || [];

		return {
			accounts,
		};
	}

	async generatePasswordHash(password: string) {
		const salt = crypto.randomBytes(8).toString('hex');
		const hash = (await scryptAsync(password, salt, 32)) as Buffer;

		return `${hash.toString('hex')}.${salt}`;
	}

	async delete(body: DeleteInstagramAuthDto, meta: Meta) {
		const { username } = body;

		const newUser = await this.userModel
			.findOneAndUpdate(
				{ _id: meta.userId },
				{
					$pull: {
						InstagramAccounts: { username: username },
					},
				},
				{ new: true }
			)
			.lean();

		if (!newUser) {
			throw new BadRequestException('User not found');
		}

		return {
			message: 'Account deleted successfully',
			instagramAccounts: newUser.InstagramAccounts,
		};
	}
}
