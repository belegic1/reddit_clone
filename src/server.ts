import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import trim from './migglewares/trim';

import { User } from './entity/User';
import authroutes from './routes/auth';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);

app.get('/', (_, res) => {
  res.send('Hello');
});

app.use('/api/auth', authroutes);

app.listen(5000, async () => {
  console.log('Server is listenning....');

  try {
    await createConnection();
    console.log('Database os connected');
  } catch (err) {
    console.log(err.message);
  }
});
