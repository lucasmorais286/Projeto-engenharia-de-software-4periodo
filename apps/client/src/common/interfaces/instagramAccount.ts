import React from 'react';

import { InstagramAccountSchema } from '@common/schemas/instagramAccount';
import { z } from 'zod';

interface InstagramAccountStore {
	id: string;
	accountId: string;
	userId: string;
	username: string;
	fullName?: string;
	biography?: string;
	followerCount: number;
	followingCount: number;
	postCount: number;
	profilePicUrl: string;
	lastLogin: Date;
	password: string;
	isPrivate?: boolean;
	isVerified?: boolean;
}

type AccountCardProps = Partial<InstagramAccountStore> & {
	setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleLogout: (username: string) => void;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

interface InstagramLogoutType {
	username: string;
}

type InstagramAccountType = z.infer<typeof InstagramAccountSchema>;

export type { AccountCardProps, InstagramAccountStore, InstagramAccountType, InstagramLogoutType };
