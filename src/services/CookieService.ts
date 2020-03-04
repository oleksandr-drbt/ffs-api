import { Response } from 'express';
import config from '../config';

class CookieService {
	public static setAuthCookie(res: Response, accessToken: string, expiresIn: number) {
		const { cookieName } = config.jwt;

		return res.cookie(cookieName, accessToken, {
			expires: new Date(Date.now() + expiresIn),
			secure: true,
			httpOnly: true,
		});
	}

	public static clearAuthCookie(res: Response) {
		const { cookieName } = config.jwt;

		return res.clearCookie(cookieName);
	}
}

export default CookieService;
