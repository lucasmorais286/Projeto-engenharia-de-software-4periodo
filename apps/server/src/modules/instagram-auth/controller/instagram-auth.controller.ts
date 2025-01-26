import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from '../services/instagram-auth.service';

@UseGuards(AuthGuard)
@Controller('instagram')
export class InstagramAuthController {
	constructor(private readonly instagramAuthService: InstagramAuthService) {}

	@Post('login')
	login(@Body() body: InstagramAuthDto, @Meta() meta: MetaType) {
		return this.instagramAuthService.login(body, meta);
	}

	@Delete('logout/:username')
	delete(@Param() query: DeleteInstagramAuthDto, @Meta() meta: MetaType) {
		return this.instagramAuthService.delete(query, meta);
	}

	@Get('accounts')
	getAccounts(@Meta() meta: MetaType) {
		return this.instagramAuthService.getAccounts(meta);
	}
}
