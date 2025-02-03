import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY!;
export const generateToken = async (payload: any) => jwt.sign(payload, secretKey, { expiresIn: '1d' });
export const verifyToken = async (token: string) => jwt.verify(token, secretKey);
