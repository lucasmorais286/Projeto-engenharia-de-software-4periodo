import { ClientResponse } from '@common/interfaces/api';

import client from './api';

export const getUserPostsWithDetails = async ({ page, limit } : { page?: number, limit?: number }	) => {
	const { data }: ClientResponse = await client.get(`/posts`, {
		params: {
			page,
			perPage: limit
		},
	});

	return {
		data,
	};
};

export const cancelPost = async ({ postId,  }: { postId: string }) => {
  const { data }: ClientResponse = await client.post(`/posts/cancel/${postId}`);

	return {
		data,
	};
};

