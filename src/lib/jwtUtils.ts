
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";

export type VerifyResult = 
  | { success: true; data: JwtPayload }
  | { success: false; message: string; error: any };

const verifyToken = (token: string, secret: string): VerifyResult => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return {
            success: true,
            data: decoded
        }
    } catch (error: any) {
        const expectedAuthFailures = new Set(['invalid signature', 'jwt expired', 'jwt malformed', 'invalid token']);
        if (!expectedAuthFailures.has(String(error?.message ?? '').toLowerCase())) {
            console.error('[jwtUtils] Token verification failed:', error.message);
        }
        return {
            success: false,
            message: error.message,
            error
        }
    }
}

const decodedToken = (token: string): JwtPayload | null => {
    const decoded = jwt.decode(token) as JwtPayload | null;
    return decoded;
}


export const jwtUtils = {
    verifyToken,
    decodedToken,
}