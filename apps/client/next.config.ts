import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'post-ai.e1cbcbbff75a52d32302f26ed7d8eb5b.r2.cloudflarestorage.com',
			},
			{
				hostname: 'instagram.*.fna.fbcdn.net'
			},
			{
				hostname: 'i.imgur.com'
			},
		],
	},
};

export default nextConfig;
