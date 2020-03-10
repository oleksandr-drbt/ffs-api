import passport from 'passport';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import UserService from '../services/UserService';
import config from '../config';
import { Request } from 'express';

const { secret, cookieName } = config.jwt;

const cookieExtractor = (req: Request): any => {
  if (req && req.cookies) {
    return req.cookies[cookieName];
  }

  return null;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
};

passport.use(new JwtStrategy(options, async (payload: any, done: VerifiedCallback) => {
  try {
    const user = await UserService.find(payload.id);

    if (!user) {
      return done(null, null);
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
