import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Post {
	@Prop({ required: true, type: String })
	caption: string;

	@Prop({ required: true, type: String })
	imageUrl: string;

	@Prop({ required: false, type: Date })
	publishedAt: Date;

	@Prop({ required: false, type: Date })
	scheduledAt: Date;

	@Prop({ required: false, type: Date })
	canceledAt: Date;

	@Prop({ required: true, type: String })
	userId: string;

	@Prop({ required: true, type: String })
	accountId: string;

	@Prop({ required: false, type: String, default: null })
	postId: string;

	@Prop({ required: false, type: String, default: null })
	code: string;

	@Prop({ required: false, type: String })
	jobId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
