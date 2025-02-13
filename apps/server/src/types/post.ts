import { CreatePostDto, GetAllPostsQueryDto } from '@modules/post/dto/post.dto';
import { Meta } from './meta';
import { Session } from '@schemas/token';

export type DefaultPostBodyCreate = {
	data?: CreatePostDto;
	meta?: Meta;
	query?: CanceledPostBody;
};

export type PublishedPostProps = DefaultPostBodyCreate & { id?: string; session?: Session };

export type PostBodyCreate = {
	caption: string;
	imageUrl: Buffer | string;
	userId: string;
	publishedAt: Date;
	scheduledAt: Date;
	canceledAt?: Date;
	jobId?: string;
};

export type CanceledPostBody = {
	postId: string;
};

export type GetUserPostsProps = {
	query: {
		page?: number;
		limit?: number;
	};
	meta: Meta
}