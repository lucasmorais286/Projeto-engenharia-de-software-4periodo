import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

import { InstagramAccountType, InstagramAccountStore } from './instagramAccount';

type HeaderProps = {
	onSubmit: SubmitHandler<InstagramAccountType>;
	handleSubmit: UseFormHandleSubmit<InstagramAccountType>;
	register: UseFormRegister<InstagramAccountType>;
	errors: FieldErrors<InstagramAccountType>;
	isLoading: boolean;
	accounts: InstagramAccountStore[];
};

export type { HeaderProps };
