import { Pagination } from '@common/dto/pagination.dto';
import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '@schemas/chat.schema';
import { Interaction } from '@schemas/interaction.schema';
import { R2Storage } from '@storages/r2-storage';
import { ListChatInteractionsOptions, RegenerateMessageData, SendMessageData } from '@type/chats';
import FileUtils from '@utils/file';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
		private readonly imageGenerationService: ImageGenerationService,
		private readonly r2Storage: R2Storage
	) {}

	findChat(chatId: string, userId: string) {
		return this.chatModel.findOne({
			_id: chatId,
			user_id: userId,
			finished_at: null,
		}).lean();
	}

	async findOrCreateChat(data: { chatId: string; userId: string; message: string }) {
		const chat = await this.findChat(data.chatId, data.userId);

		if (!chat) {
			return this.chatModel.create({
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
			response: FileUtils.getUnsignedUrl(url),
			is_regenerated: false,
			createdAt: new Date(),
			updatedAt: new Date(),
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

	async regenerateMessage({ data, meta }: RegenerateMessageData) {
		const { chatId, message, interactionId } = data;

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

		const partialInteractionBody = {
			user_id: meta.userId.toString(),
			request: message,
			response: FileUtils.getUnsignedUrl(url),
			is_regenerated: true,
			updatedAt: new Date(),
		};

		await this.chatModel.updateOne(
			{
				_id: chatId,
				'interactions._id': interactionId,
			},
			{
				$set: {
					'interactions.$.user_id': partialInteractionBody.user_id,
					'interactions.$.request': partialInteractionBody.request,
					'interactions.$.response': partialInteractionBody.response,
					'interactions.$.is_regenerated': partialInteractionBody.is_regenerated,
					'interactions.$.updatedAt': partialInteractionBody.updatedAt,
				},
			}
		);

		return {
			chat: {
				userId: chat.user_id,
				interactions: chat.interactions,
				firstMessage: chat.first_message,
				id: chat._id,
				createdAt: chat.createdAt,
			},
			interaction: {
				request: partialInteractionBody.request,
				response: partialInteractionBody.response,
				isRegenerated: partialInteractionBody.is_regenerated,
			},
		};
	}

	async getChatContext(interactions: Interaction[]) {
		return interactions
			.slice(-10)
			.map((interaction) => `Request: ${interaction.request} | Response: ${interaction.response}`)
			.join('\n');
	}

	async listChatInteractions({ params, meta }: ListChatInteractionsOptions) {
		const chat = await this.findChat(params.chatId, meta.userId.toString());

		if (!chat) {
			throw new NotFoundException('CHAT_NOT_FOUND');
		}

		const interactions = chat.interactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		const mountedInteractions = await Promise.all(
			interactions.map(async (interaction) => ({
				...interaction,
				response: await this.r2Storage.getSignedImageUrl(interaction.response),
			}))
		);

		console.log(mountedInteractions, 'mountedInteractions');

		return mountedInteractions;
	}

	async listUserChats({ userId, pagination }: { userId: string; pagination?: Pagination }) {
		const { page, perPage, offset } = pagination;

		const [chats, allUserChatsCount] = await Promise.all([
			this.chatModel
				.find({ user_id: userId.toString() })
				.sort({ createdAt: -1, _id: -1 })
				.skip(offset)
				.limit(perPage)
				.lean(),
			this.chatModel.countDocuments({ user_id: userId }),
		]);

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
				limit: perPage,
			},
		};
	}
}
