import { DEFAULT_PROMPT } from '@constants/ai';
import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Storage } from '@storages/r2-storage';
import { GeneratedImage, GenerateImageOptions } from '@type/post';
import axios from 'axios';

@Injectable()
export class IdeogramRepository implements ImageGenerationService {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(
		private configService: ConfigService,
		private storageService: R2Storage
	) {
		this.apiKey = this.configService.get<string>('IDEOGRAM_API_KEY');
		this.baseUrl = this.configService.get<string>('IDEOGRAM_BASE_URL');
	}

	private generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(options: GenerateImageOptions): Promise<GeneratedImage> {
		const mountedPrompt = this.generatePrompt(options.prompt);

		const mountedGenerateImagePayload = {
			image_request: {
				prompt: mountedPrompt,
				model: 'V_2',
				magic_prompt_option: 'AUTO',
				num_images: options.n || 1,
				resolution: 'RESOLUTION_1024_1024',
			},
		};

		const response = await axios.post(`${this.baseUrl}/generate`, mountedGenerateImagePayload, {
			headers: {
				'Api-Key': this.apiKey,
				'Content-Type': 'application/json',
			},
		});

		const url = response.data.data[0].url;

		const uploadedImage = await this.storageService.downloadAndUploadImage(url);

		return {
			url: uploadedImage.key,
		};
	}
}
