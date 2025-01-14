import type { Router } from 'express';
import { Router as router } from 'express';
import userController from './user.controller';
const userRouter: Router = router();
userRouter.post('/login', userController.login);
userRouter.post('/register', userController.register);
export default userRouter;
