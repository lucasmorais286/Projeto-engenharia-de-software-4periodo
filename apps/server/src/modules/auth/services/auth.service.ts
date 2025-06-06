import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { AuthenticateType } from '@type/auth';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/auth.dto';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService
	) {}

	async authenticate({ email, password, res }: AuthenticateType) {
		const user = await this.userModel.findOne({ email }).lean();

		if (!user) {
			const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';
			await bcrypt.compare(password, FAKE_PASSWORD);
			throw new UnauthorizedException('Invalid credentials');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '1d' });

		const refreshToken = await this.generateToken({ user, expiresIn: '1d' });

		const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: DAY_IN_MILLISECONDS,
			path: '/',
		});

		return {
			user: {
				...omit(user, 'password'),
				id: user._id.toString(),
			},
			token: accessToken,
		};
	}

	async refreshToken(req: Request) {
		const refreshToken = req.cookies['refreshToken'];

		if (!refreshToken) {
			throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
		}

		const payload = await this.jwtService.verifyAsync(refreshToken, {
			secret: this.config.get('JWT_SECRET'),
		});

		const user = await this.userModel.findById(payload.userId).lean();

		if (!user) {
			throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '15m' });

		return {
			token: accessToken,
		};
	}

	async logout(res: Response) {
		res.clearCookie('refreshToken');
	}

	async register({ name, email, password }: RegisterDto) {
		const existsUser = await this.userModel.countDocuments({ email });

		if (existsUser) {
			throw new UnauthorizedException('REGISTRATION_FAILED');
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = await this.userModel.create({
			name,
			email,
			password: passwordHash,
		});

		return {
			user: {
				name: newUser?.name,
				email: newUser?.email,
				id: newUser?._id.toString(),
			},
		};
	}

	generateToken({ user, expiresIn }) {
		const payload = { userId: user._id, email: user.email };

		return this.jwtService.signAsync(payload, {
			secret: this.config.get('JWT_SECRET'),
			expiresIn,
		});
	}
}
