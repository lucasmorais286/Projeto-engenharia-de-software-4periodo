import { DEFAULT_PROMPT } from '@constants/ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Storage } from '@storages/r2-storage';
import { OpenAI } from 'openai';
import { CreateOpenaiDto } from '../dto/openai.dto';

@Injectable()
export class OpenaiService {
	private readonly openai: OpenAI;

	constructor(
		private configService: ConfigService,
		private storageService: R2Storage
	) {
		const apiKey = this.configService.get<string>('OPENAI_API_KEY');
		this.openai = new OpenAI({ apiKey });
	}

	generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(data: CreateOpenaiDto): Promise<{ url: string }> {
		const { prompt } = data;

		const mountedPrompt = this.generatePrompt(prompt);

		const response = await this.openai.images.generate({
			model: 'dall-e-3',
			prompt: mountedPrompt,
			n: 1,
			quality: 'standard',
			size: '1024x1024',
		});

		const url = response.data[0].url;

		const uploadedImage = await this.storageService.downloadAndUploadImage(url);

		return {
			url: uploadedImage.url,
		};
	}
}
