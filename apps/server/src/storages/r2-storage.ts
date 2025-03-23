import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Uploader, UploadParams } from '@type/storage';
import axios from 'axios';
import { randomUUID } from 'node:crypto';

@Injectable()
export class R2Storage implements Uploader {
	private client: S3Client;

	constructor(private configService: ConfigService) {
		const accountId = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
		const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com/${bucketName}`,
			region: 'auto',
			credentials: {
				accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
			},
		});
	}

	async upload({ fileName, fileType, body }: UploadParams): Promise<{ key: string }> {
		const uploadId = randomUUID();

		const uniqueFileName = `${uploadId}-${fileName}`;

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
				Key: uniqueFileName,
				ContentType: fileType,
				Body: body,
			})
		);

		return {
			key: uniqueFileName,
		};
	}

	async getSignedImageUrl(fileName: string): Promise<string> {
		const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

		const command = new GetObjectCommand({
			Bucket: bucketName,
			Key: fileName,
		});

		return getSignedUrl(this.client, command, { expiresIn: 3600 });
	}

	async downloadAndUploadImage(url: string): Promise<{ key: string }> {
		const response = await axios.get(url, { responseType: 'arraybuffer' });

		const mimeType = response.headers['content-type'];

		return await this.upload({
			fileType: mimeType,
			fileName: 'image.jpg',
			body: response.data,
		});
	}
}
