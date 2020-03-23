import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(path.join(__dirname, '..', '..', envPath)) });

const config = {
  server: {
    url: process.env.APP_URL || 'http://localhost',
    port: parseInt(process.env.APP_PORT || '3001'),
  },
  db: {
    client: process.env.DB_CLIENT || 'pg',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_DATABASE || 'app',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400'),
    cookieName: process.env.JWT_COOKIE_NAME || 'app',
  },
};

export default config;
