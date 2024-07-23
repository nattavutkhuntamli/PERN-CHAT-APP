import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';

// อินเทอร์เฟซสำหรับ Token ที่ถูกถอดรหัส
interface DecodedToken extends JwtPayload {
    userId: string;
}

// ขยายคำจำกัดความของ Request ใน Express เพื่อเพิ่มคุณสมบัติ user
declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string,
            };
        }
    }
}

// มิดเดิลแวร์สำหรับการป้องกันเส้นทาง (Protect Route)
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ดึง token จากคุกกี้
        const token = req.cookies.jwt;
        if (!token) {
            // ถ้าไม่มี token ตอบกลับด้วยสถานะ 401 (Unauthorized)
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        // ตรวจสอบและถอดรหัส token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (!decoded) {
            // ถ้า token ไม่ถูกต้อง ตอบกลับด้วยสถานะ 401 (Unauthorized)
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ userId ที่ได้จาก token
        const user = await prisma.user.findUnique({ 
            where: { id: decoded.userId }, 
            select: { id: true, username: true, fullName: true, profilePic: true } 
        });
        if (!user) {
            // ถ้าไม่พบผู้ใช้ ตอบกลับด้วยสถานะ 401 (Unauthorized)
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        // แนบข้อมูลผู้ใช้ไปยัง request object
        req.user = user;

        // ไปยังมิดเดิลแวร์หรือ route handler ถัดไป
        next();
    } catch (error: any) {
        // ถ้ามีข้อผิดพลาด เก็บ log และตอบกลับด้วยสถานะ 500 (Internal server error)
        console.log(`Error in protectRoute middleware: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default protectRoute;
