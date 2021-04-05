import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import trim from './migglewares/trim';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

import authroutes from './routes/auth';
import postroutes from './routes/post';
import subroutes from './routes/sub';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan('dev'));
app.use(trim);

app.get('/', (_, res) => {
  res.send('Hello');
});

app.use('/api/auth', authroutes);
app.use('/api/posts', postroutes);
app.use('/api/subs', subroutes);

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log('Server is listenning....');

  try {
    await createConnection();
    console.log('Database os connected');
  } catch (err) {
    console.log(err.message);
  }
});
