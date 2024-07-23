// backend/src/utils/generateToken.ts
import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
    res.cookie('jwt', token, {
        maxAge:  24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // Prevent XSS cross-site scripting
        sameSite: 'strict', // Prevent CSRF cross-site request forgery
        secure: process.env.NODE_ENV === 'development', // Only set cookie over HTTPS in production environment
    });
    return token;
};

export default generateToken;
