import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { OpenaiService } from '@modules/openai/service/openai.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '@schemas/chat.schema';
import { Interaction } from '@schemas/interaction.schema';
import { ListChatInteractionsOptions, SendMessageData } from '@type/chats';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
		private openaiService: OpenaiService,
		private readonly imageGenerationService: ImageGenerationService
	) {}

	async findChat(chatId: string, userId: string) {
		const chat = await this.chatModel.findOne({
			_id: chatId,
			user_id: userId,
			finished_at: null,
		});

		if (!chat) {
			throw new NotFoundException('CHAT_NOT_FOUND');
		}

		return chat;
	}

	async findOrCreateChat(data: { chatId: string; userId: string; message: string }) {
		const chat = await this.chatModel.findOne({
			_id: data.chatId,
			user_id: data.userId,
		});

		if (!chat) {
			return new this.chatModel({
				user_id: data.userId,
				finished_at: null,
				first_message: data.message,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		return chat;
	}

	async sendMessage({ data, meta }: SendMessageData) {
		const { chatId, message } = data;

		const chat: ChatDocument = await this.findOrCreateChat({
			userId: meta.userId.toString(),
			message,
			chatId,
		});

		const context = await this.getChatContext(chat.interactions);

		const { url } = await this.imageGenerationService.generateImage({
			prompt: `${data.message}\n\nContext: ${context}`,
		});

		if (!url) {
			throw new BadRequestException('IMAGE_GENERATION_FAILED');
		}

		const interactionBody = {
			user_id: meta.userId.toString(),
			request: message,
			response: url,
			is_regenerated: false,
		};

		chat.interactions.push(interactionBody);

		await chat.save();

		return {
			chat: {
				userId: chat.user_id,
				interactions: chat.interactions,
				firstMessage: chat.first_message,
				id: chat._id,
				createdAt: chat.createdAt,
			},
			interaction: {
				request: interactionBody.request,
				response: interactionBody.response,
				isRegenerated: interactionBody.is_regenerated,
			},
		};
	}

	async getChatContext(interactions: Interaction[]) {
		return interactions
			.slice(0, 10)
			.map((interaction) => `Request: ${interaction.request} | Response: ${interaction.response}`)
			.join('\n');
	}

	async listChatInteractions(options: ListChatInteractionsOptions) {
		const { params, meta } = options;

		const chat = await this.findChat(params.chatId, meta.userId.toString());

		return chat.interactions.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
	}

	async listUserChats({ userId, pagination }: { userId: string; pagination?: { page: number; limit: number } }) {
		const { page, limit } = pagination || {};

		const query = this.chatModel.find({ user_id: userId.toString() }).sort({ createdAt: -1, _id: -1 });

		if (pagination) {
			const skip = pagination ? (page - 1) * limit : undefined;
			query.skip(skip);
			query.limit(limit);
		}

		const chats = await query.lean();

		const allUserChatsCount = await this.chatModel
			.countDocuments({
				user_id: userId,
			})
			.lean();

		return {
			results: chats.map((chat) => ({
				userId: chat.user_id.toString(),
				interactions: chat.interactions,
				firstMessage: chat.first_message,
				id: chat._id.toString(),
				createdAt: chat.createdAt,
			})),
			meta: {
				total: allUserChatsCount,
				page,
				limit,
			},
		};
	}
}
