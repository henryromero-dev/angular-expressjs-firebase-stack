import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { Role } from '../entities/role.entity';

export const PermissionsMiddleware = (access: string) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            const roleName = (<any>req)['roleName'];
            const roleRef = await db.collection('roles').where('name', '==', roleName).get();
            const role = <Role>roleRef.docs[0].data();

            if (!role || !role.permissions.includes(access)) {
                return res.status(401).send({
                    message: 'unauthorized'
                });
            }

            next(); 
        } catch (error) {
            return res.status(500).send(error);
        }
    };
};
