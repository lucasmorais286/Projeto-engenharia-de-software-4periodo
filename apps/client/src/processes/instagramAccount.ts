import { ClientResponse } from '@common/interfaces/api';
import { InstagramAccountType, InstagramLogoutType } from '@common/interfaces/instagramAccount';

import client from './api';

export const instagramLogin = async (body: InstagramAccountType) => {
	const { data }: ClientResponse = await client.post(`/instagram/login`, body);

	return {
		data,
	};
};

export const getUserInstagramAccounts = async () => {
	const { data }: ClientResponse = await client.get(`/instagram/accounts`);

	return {
		data: data?.accounts,
	};
};

export const instagramLogout = async (filter: InstagramLogoutType) => {
	const { data }: ClientResponse = await client.delete(`/instagram/logout/${filter.userName}`);

	return {
		data,
	};
};
