import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../config';
import { TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_NOT_PROVIDED } from '../constants/errorMessages';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { cookieName, secret } = config.jwt;
  const authorization = req.cookies[cookieName] || req.headers.authorization || '';

  if (!authorization) {
    res.status(401).send({ message: TOKEN_NOT_PROVIDED });
    return;
  }

  try {
    const token = authorization.replace('Bearer ', '');
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).send({ message: TOKEN_EXPIRED });
    } else {
      res.status(401).send({ message: TOKEN_INVALID });
    }
  }
};

export default auth;
