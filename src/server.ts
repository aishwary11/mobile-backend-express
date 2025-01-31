import cors from 'cors';
import 'dotenv/config';
import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';
import pc from 'picocolors';
import connectDB from './common/db/config';
import userRouter from './components/user/user.route';
import errorMiddleware from './middleware/error.middleware';
import isAuthenticated from './middleware/isAuthenticated';
import logger from './middleware/logger';
import notFound from './middleware/notFound';

const app: Express = express();

const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(logger);

app.use('/user', userRouter);
app.use(isAuthenticated);

app.use('*', notFound);
app.use(errorMiddleware);

app.listen(port, () => console.log(`Server is running on port ${pc.yellow(port)}`));
