import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalGuards();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		})
	);
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.enableVersioning();

	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			crossOriginEmbedderPolicy: false,
		})
	);

	const allowedOrigins = [/https:\/\/teste\.com$/, /https:\/\/teste\.teste\.com$/];

	const corsOptions: CorsOptions = {
		origin: (origin, callback) => {
			if (process.env.NODE_ENV === 'development') {
				return callback(null, true);
			}

			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.some((regex) => regex.test(origin))) {
				callback(null, true);
			} else {
				callback(new Error('Origin not allowed by CORS'));
			}
		},
		credentials: true,
	};

	app.enableCors(corsOptions);

	await app.listen(process.env.PORT);
}

bootstrap();
