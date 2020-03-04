import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(path.join(__dirname,  '..', '..', envPath)) });

const config = {
	server: {
		port: parseInt(process.env.APP_PORT || '3001'),
	},
	db: {
		client: process.env.DB_CLIENT || '',
		host: process.env.DB_HOST || '',
		port: process.env.DB_PORT || '',
		database: process.env.DB_DATABASE || '',
		user: process.env.DB_USER || '',
		password: process.env.DB_PASSWORD || '',
	},
	jwt: {
		secret: process.env.JWT_SECRET || '',
		expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400'),
		cookieName: process.env.JWT_COOKIE_NAME || 'express-app',
	}
};

export default config;
