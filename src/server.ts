import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import type { Express } from 'express';
import express from 'express';
import fileUpload from 'express-fileupload';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import os from 'os';
import pc from 'picocolors';
import { STATUS_CODES } from './common/constant';
import start from './common/utils/start';
import galleryRouter from './components/gallery/gallery.route';
import userRouter from './components/user/user.route';
import errorMiddleware from './middleware/errorMiddleware';
import isAuthenticated from './middleware/isAuthenticated';
import logger from './middleware/logger';
import notFound from './middleware/notFound';

const app: Express = express();
const port: number = parseInt(process.env.PORT!) || 5000;
const numCPUs: number = os.cpus().length;

start();
app.use(logger);
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 25,
    message: 'Too many requests from this IP, please try again after a minute.',
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(compression());
app.use('/user', userRouter);
app.use(isAuthenticated);
app.use('/gallery', galleryRouter);
app.use('*', notFound);
app.use(errorMiddleware);

// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
// } else {
app.listen(port, () => {
  console.log(`Server is running on port ${pc.yellow(port)} 🚀`);
});
// }
function shutDown() {
  console.log('Shutting down server...');
  process.exit(0);
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  shutDown();
});
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection:', reason, 'at', promise);
  shutDown();
});