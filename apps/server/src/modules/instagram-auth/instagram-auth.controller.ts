import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { InstagramAuthService } from './instagram-auth.service';

@Controller('instagram')
export class InstagramAuthController {
    constructor(private readonly instagramAuthService: InstagramAuthService) {}

    @Get('login')
    @Redirect()
    login() {
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.instagramAuthService['clientId']}&redirect_uri=${this.instagramAuthService['redirectUri']}&scope=user_profile&response_type=code`;
        return { url: instagramAuthUrl };
    }

    @Get('callback')
    async callback(@Query('code') code: string) {
        const tokenResponse = await this.instagramAuthService.exchangeCodeForToken(code);
        const userProfile = await this.instagramAuthService.getUserProfile(tokenResponse.access_token);
        return { token: tokenResponse, user: userProfile };
    }
}
