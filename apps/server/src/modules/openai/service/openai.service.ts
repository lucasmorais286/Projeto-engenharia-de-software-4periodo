import { DEFAULT_PROMPT } from '@constants/ai';
import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
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
		private storageService: R2Storage,
		private imageGenerationService: ImageGenerationService
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

		const response = await this.imageGenerationService.generateImage({
			prompt: mountedPrompt,
		});

		const url = response.url;

		const uploadedImage = await this.storageService.downloadAndUploadImage(url);

		return {
			url: uploadedImage.key,
		};
	}
}
