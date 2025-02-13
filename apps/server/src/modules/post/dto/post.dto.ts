import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf, IsNumber } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	@Transform((params: TransformFnParams) => sanitizeHtml(params.value))
	@Escape()
	caption: string;

	@IsOptional()
	@IsString()
	@IsUrl()
	img: string;

	@IsOptional()
	@IsDate()
	@Transform((obj) => new Date(obj.value))
	post_date: Date;
}

export class CancelPostQueryDto {
	@IsString()
	@IsNotEmpty()
	@ValidateIf((obj) => !obj.username)
	postId: string;
}

export class GetAllPostsQueryDto {
	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;
}


