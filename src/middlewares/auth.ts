import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../config';
import {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  TOKEN_NOT_PROVIDED,
  USER_NOT_FOUND,
} from '../constants/errorMessages';
import UserService from '../services/UserService';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { cookieName, secret } = config.jwt;
  const authorization = req.cookies[cookieName] || req.headers.authorization || '';

  if (!authorization) {
    res.status(401).send({ message: TOKEN_NOT_PROVIDED });
    return;
  }

  try {
    const token = authorization.replace('Bearer ', '');
    const authData = jwt.verify(token, secret);
    // @ts-ignore
    const user = await UserService.find(authData.id);

    if (!user) {
      res.status(404).send({ message: USER_NOT_FOUND });
      return;
    }

    req.user = user;
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
