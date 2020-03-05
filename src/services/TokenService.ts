import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';

class TokenService {
  public static async generateAccessToken(user: User) {
    const { id, email } = user;
    const { secret, expiresIn } = config.jwt;

    const accessToken = await jwt.sign({ id, email }, secret, {
      expiresIn,
    });

    return {
      access_token: accessToken,
      expires_in: expiresIn,
    };
  }
}

export default TokenService;
