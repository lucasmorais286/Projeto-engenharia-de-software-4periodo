import { ClientResponse } from '@common/interfaces/api';

import client from './api';

export const getUserPostsWithDetails = async ({ page, limit} : {page?: number, limit?: number}	) => {
	const { data }: ClientResponse = await client.get(`/posts`, {
		params: {
			page,
			limit
		},	
	});

	return {
		data,
	};
};

export const cancelPost = async ({ postId,  }: { postId: string }) => {
  const { data }: ClientResponse = await client.post(`/posts/canceled?postId=${postId}`);
	
	return {
		data,
	};
};

