import cors from 'cors';
import 'dotenv/config';
import type { Express, Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import pc from 'picocolors';
import { STATUS_CODES } from './common/constant';
import connectDB from './common/db/config';
import responseHelper from './common/utils/responsehelpers';
import userRouter from './components/user/user.route';
import errorMiddleware from './middleware/errorMiddleware';
import isAuthenticated from './middleware/isAuthenticated';
import logger from './middleware/logger';
import notFound from './middleware/notfound';

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
app.get('/', (req: Request, res: Response) => {
  responseHelper(res, STATUS_CODES.OK, "Demo");
});

app.use('*', notFound);
app.use(errorMiddleware);

app.listen(port, () => console.log(`Server is running on port ${pc.yellow(port)}`));
