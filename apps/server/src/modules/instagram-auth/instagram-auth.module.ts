import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { Post, PostSchema } from '@schemas/post.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { R2Storage } from '@storages/r2-storage';
import { IgApiClient } from 'instagram-private-api';
import { InstagramAuthController } from './controller/instagram-auth.controller';
import { InstagramAuthService } from './services/instagram-auth.service';

@Module({
	imports: [
		DatabaseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Post.name, schema: PostSchema },
		]),
	],
	controllers: [InstagramAuthController],
	providers: [InstagramAuthService, IgApiClient, R2Storage],
})
export class InstagramAuthModule {}
