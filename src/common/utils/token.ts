import jwt from 'jsonwebtoken';
import constant from '../constant';
export const generateToken = (payload: any) => jwt.sign(payload, constant.secret, { expiresIn: constant.expire });
export const verifyToken = (token: string) => jwt.verify(token, constant.secret);
