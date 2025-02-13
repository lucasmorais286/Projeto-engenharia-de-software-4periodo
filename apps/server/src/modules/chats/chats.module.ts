import { OpenaiModule } from '@modules/openai/openai.module';
import { OpenaiService } from '@modules/openai/service/openai.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '@schemas/chat.schema';
import { Interaction, InteractionSchema } from '@schemas/interaction.schema';
import { R2Storage } from '@storages/r2-storage';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './services/chats.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Chat.name, schema: ChatSchema },
			{ name: Interaction.name, schema: InteractionSchema },
		]),
		OpenaiModule,
	],
	controllers: [ChatsController],
	providers: [ChatsService, OpenaiService, R2Storage],
})
export class ChatsModule {}
