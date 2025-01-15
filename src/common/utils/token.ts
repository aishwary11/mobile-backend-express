import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY!;
const expire = process.env.EXPIRE!;
export const generateToken = async (payload: any) => jwt.sign(payload, secretKey, { expiresIn: expire });
export const verifyToken = async (token: string) => jwt.verify(token, secretKey);
