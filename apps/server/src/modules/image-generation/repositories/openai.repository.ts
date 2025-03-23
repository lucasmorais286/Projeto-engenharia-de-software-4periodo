import { DEFAULT_PROMPT } from '@constants/ai';
import {
	ImageGenerationService
} from '@modules/image-generation/service/image-generation.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Storage } from '@storages/r2-storage';
import { GenerateImageOptions, GeneratedImage } from '@type/post';
import OpenAI from 'openai';

@Injectable()
export class OpenAIRepository implements ImageGenerationService {
	private openai: OpenAI;
	private storageService: R2Storage;

	constructor(private configService: ConfigService) {
		const apiKey = this.configService.get<string>('OPENAI_API_KEY');
		this.openai = new OpenAI({ apiKey });
	}

	generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(options: GenerateImageOptions): Promise<GeneratedImage> {
		const mountedPrompt = this.generatePrompt(options.prompt);

		const response = await this.openai.images.generate({
			model: 'dall-e-3',
			prompt: mountedPrompt,
			n: options.n || 1,
			quality: 'standard',
			size: '1024x1024',
		});

		const url = response.data[0].url;

		const uploadedImage = await this.storageService.downloadAndUploadImage(url);

		return {
			url: uploadedImage.key,
		};
	}
}
