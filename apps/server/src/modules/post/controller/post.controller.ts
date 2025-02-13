import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, Query, UseGuards, Get } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import { CancelPostQueryDto, CreatePostDto, GetAllPostsQueryDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(@Body() data: CreatePostDto, @Meta() meta: MetaType) {
		return this.postService.create({ data, meta });
	}

	@Post('canceled')
	canceled(@Query() query: CancelPostQueryDto, @Meta() meta: MetaType) {
		return this.postService.cancelScheduledPost({
			query,
			meta,
		});
	}

	@Get()
	getUserPosts(
		@Query() query: GetAllPostsQueryDto,
		@Meta() meta: MetaType
	) {
		return this.postService.getUserPostsWithDetails({query, meta});
	}
}
