import { InstagramAccountStore } from "./instagramAccount";

export interface PostEntity {
	_id: string;
	caption: string;
	imageUrl: string;
	userId: string;
	accountId: string;
	publishedAt: Date;
	scheduledAt: Date;
	canceledAt?: Date;
	jobId?: string;
}

export interface PostEntityWithDetails extends PostEntity {
	code: string; // for redirect to post
	createdAt: string;
	user: {
		name: string;
		email: string;
		profilePicUrl?: string;
	};
	account: {
		username: string;
		profilePicUrl?: string;
	};
	engagement?: {
		hasLiked: boolean;
		likes: number;
		comments: number;
	};
	comments?: {
		recent: Array<{
			text: string;
			user: {
				username: string;
				profile_pic_url: string;
				verified: boolean;
			};
			created_at: string;
			like_count: number;
			reply_count: number;
		}>;
		has_more: boolean;
	};
}
