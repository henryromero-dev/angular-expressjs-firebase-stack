import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = <string>req.headers['authorization']?.split(' ')[1];
        const payload: any = verify(jwt, <string>process.env.SECRETE_TOKEN);

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        (<any>req)['uId'] = payload.user.id;
        (<any>req)['roleName'] = payload.user.roleName;
        next();
    } catch (error) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
};
