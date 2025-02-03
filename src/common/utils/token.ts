import jwt from 'jsonwebtoken';

const secretKey: string = process.env.SECRET_KEY!;
export const generateToken = (payload: any) => jwt.sign(payload, secretKey);
export const verifyToken = (token: string) => jwt.verify(token, secretKey);
