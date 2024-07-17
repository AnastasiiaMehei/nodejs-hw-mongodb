import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = env('PORT', '8080');

export function setupServer() {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cookieParser());
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  // app.use(contactsRouter);
  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}
