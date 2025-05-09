import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'post-ai.e1cbcbbff75a52d32302f26ed7d8eb5b.r2.cloudflarestorage.com',
			},
			{
				hostname: 'instagram.frec41-1.fna.fbcdn.net'
			},
			{
				hostname: 'i.imgur.com'
			},
			{
				hostname: 'instagram.frec3-1.fna.fbcdn.net'
			}
		],
	},
};

export default nextConfig;
