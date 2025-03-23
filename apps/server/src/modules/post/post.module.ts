import { DatabaseModule } from '@database/database.module';
import { InstagramAuthService } from '@modules/instagram-auth/services/instagram-auth.service';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { R2Storage } from '@storages/r2-storage';
import { IgApiClient } from 'instagram-private-api';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
	],
	controllers: [PostController],
	providers: [PostService, IgApiClient, InstagramAuthService, R2Storage],
})
export class PostModule {}
