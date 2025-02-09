import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import type { Express } from 'express';
import express from 'express';
import fileUpload from 'express-fileupload';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import pc from 'picocolors';
import { STATUS_CODES } from './common/constant';
import connectDB from './common/db/config';
import galleryRouter from './components/gallery/gallery.route';
import userRouter from './components/user/user.route';
import errorMiddleware from './middleware/errorMiddleware';
import logger from './middleware/logger';
import notFound from './middleware/notFound';

const app: Express = express();
const port: number = parseInt(process.env.PORT!) || 5000;

connectDB();
app.use(logger);
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: 'Too many requests from this IP, please try again after a minute.',
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(compression());
app.use('/user', userRouter);
// app.use(isAuthenticated); 
app.use('/gallery', galleryRouter);
app.use('*', notFound);
app.use(errorMiddleware);

app.listen(port, () =>
  console.log(`Server is running on port ${pc.yellow(port)}`)
);
