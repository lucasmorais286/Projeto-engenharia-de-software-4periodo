'use client';

import { useMemo } from 'react';

import { AccountCardProps } from '@common/interfaces/instagramAccount';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { DropdownMenuItem } from '@components/ui/dropdown-menu';
import { BadgeCheck, LockKeyhole, LockOpen } from 'lucide-react';

export default function AccountCard({ fullName, username, profilePicUrl, isPrivate, isVerified }: AccountCardProps) {
	const fallBackName = fullName?.split(' ');

	const icon = useMemo(() => {
		if (isVerified) {
			return <BadgeCheck className="h-3 w-3 text-blue-500" />;
		}

		if (isPrivate) {
			return <LockKeyhole className="h-3 w-3 text-zinc-600" />;
		}

		return <LockOpen className="h-3 w-3 text-zinc-600" />;
	}, [isPrivate, isVerified]);

	return (
		<DropdownMenuItem className="flex items-center gap-4">
			<Avatar className="h-6 w-6">
				<AvatarImage crossOrigin="anonymous" src={profilePicUrl} alt="profile instagram picture" />
				{fallBackName ? (
					<AvatarFallback>
						{fallBackName[0]} {fallBackName[1]}
					</AvatarFallback>
				) : null}
			</Avatar>

			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<span className="text-xs font-medium">Post ai</span>
					{icon}
				</div>
				<span className="text-xs text-zinc-600">@{username}</span>
			</div>
		</DropdownMenuItem>
	);
}
