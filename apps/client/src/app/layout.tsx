import Store from '@lib/react-query';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Post-ai',
	description:
		'Crie posts incríveis para Instagram com IA, de forma automática e criativa. Simples, rápido e eficiente!',
	icons: {
		icon: '/logo.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={`${plusJakarta.variable} antialiased`}>
				<Store>{children}</Store>
			</body>
		</html>
	);
}
