import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from './libs/passport';
import webRouter from './routes/web';
import apiRouter from './routes/api';
import { db } from './libs/db';
import { PAGE_NOT_FOUND } from './constants/errorMessages';

const app: Application = express();

db.init();

app.use(logger('dev'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'storage')));
app.use(passport.initialize());

app.use('/', webRouter);
app.use('/api', apiRouter);
app.use((req: Request, res: Response) => {
  res.status(404).send({ message: PAGE_NOT_FOUND });
});

export default app;
