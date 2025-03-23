'use client';

import { useCallback, useState } from 'react';

import { InstagramAccountStore, InstagramAccountType } from '@common/interfaces/instagramAccount';
import { InstagramAccountSchema } from '@common/schemas/instagramAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstagramMutation } from '@hooks/useInstagramMutation';
import { getUserInstagramAccounts } from '@processes/instagramAccount';
import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';

import userStore from '@stores/userStore';
import Header from './header';

const HeaderContainer = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const { user } = userStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<InstagramAccountType>({
		resolver: zodResolver(InstagramAccountSchema),
		mode: 'onSubmit',
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const { mutate: instagramCreateMutate, isPending: isCreatePending } = useInstagramMutation('create', setModalOpen);
	const { mutate: instagramLoginMutate, isPending: isLoginPending } = useInstagramMutation('login', setModalOpen);
	const { mutate: instagramLogoutMutate } = useInstagramMutation('logout');

	const { data } = useQuery<{ data: InstagramAccountStore[] }>({
		queryKey: ['instagram-accounts', user?.email],
		queryFn: () => getUserInstagramAccounts(),
	});

	const handleLogout = useCallback(
		(username: string) => {
			instagramLogoutMutate({ username });
		},
		[instagramLogoutMutate]
	);

	const onSubmit = useCallback<SubmitHandler<InstagramAccountType>>(
		(body) => {
			if (isLogin) {
				return instagramLoginMutate(body);
			}

			return instagramCreateMutate(body);
		},
		[instagramCreateMutate, instagramLoginMutate, isLogin]
	);

	return (
		<Header
			accounts={data?.data || []}
			onSubmit={onSubmit}
			isLoginPending={isLoginPending}
			modalOpen={modalOpen}
			setModalOpen={setModalOpen}
			handleLogout={handleLogout}
			handleSubmit={handleSubmit}
			setIsLogin={setIsLogin}
			register={register}
			reset={reset}
			errors={errors}
			isLoading={isCreatePending}
		/>
	);
};

export default HeaderContainer;
