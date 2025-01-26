'use client';

import { useCallback, useState } from 'react';

import { mappedErrors } from '@common/constants/error';
import { AuthLoginType, AuthCardProps } from '@common/interfaces/auth';
import { LoginSchema } from '@common/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@processes/auth';
import { userStore } from '@stores/index';
import { localStorageSet } from '@utils/storage';
import { errorToast, successToast } from '@utils/toast';
import { redirect } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

import LoginCard from './loginCard';

const LoginCardContainer = ({ toggleAuthMode }: AuthCardProps) => {
    const setUser = userStore((state) => state.setUser);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthLoginType>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = useCallback<SubmitHandler<AuthLoginType>>(
        async (user: AuthLoginType) => {
            setLoading(true);
            const { data, error } = await login(user);

            if (error) {
                setLoading(false);
                errorToast(mappedErrors[error.message] || 'Algo de errado aconteceu, tente novamente.');
                return;
            }

            setUser(data.user);

            localStorageSet('token', data.token);
            localStorageSet('user', data.user);

            setTimeout(() => {
                successToast('Login efetuado com sucesso!');
            }, 1000);

            setLoading(false);
            redirect('/chat');
        },
        [setUser]
    );

    return (
        <LoginCard
            loading={loading}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            toggleAuthMode={toggleAuthMode}
        />
    );
};

export default LoginCardContainer;
