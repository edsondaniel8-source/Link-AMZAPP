import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user: {
        uid: string;
        claims: {
            sub: string;
            email?: string;
            name?: string;
        };
        email?: string;
        displayName?: string;
    };
}
export declare const verifyFirebaseToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=firebaseAuth.d.ts.map