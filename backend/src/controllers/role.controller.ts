import { Request, Response } from 'express';
import { db } from '../config/firebase.config';

export namespace RoleController {
    export const Get = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const rolesRef = db.collection('roles');
            const snapshot = await rolesRef.doc(id.toString()).get();
            const role = { id: snapshot.id, ...snapshot.data() };

            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ error });
        }
    };

    export const List = async (req: Request, res: Response) => {
        try {
            const rolesRef = db.collection('roles');
            const snapshot = await rolesRef.get();
            const roles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    
    export const Create = async (req: Request, res: Response) => {
        try {
            const { name, permissions } = req.body; 

            const rolRef = await db.collection('roles').add({ name: name });

            const permissionsPromises = permissions.map(async (permission: any) => {
                await rolRef.collection('permissions').add(permission); 
            });
            await Promise.all(permissionsPromises);

            res.json({ id: rolRef.id, ...req.body });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    export const Update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const { name, description, permissions } = req.body;

            const rolRef = db.collection('roles').doc(id);

            const permissionsSnapshot = await rolRef.collection('permissions').get();
            const exists = permissionsSnapshot.docs.map(doc => doc.data()); 
        
            const toDelete = exists.filter((x: any) => !permissions.find((x: any) => x.name === x.name));
            const toAdd = permissions.filter((x: any) => !exists.find((x: any) => x.name === x.name));
            const toUpdate = permissions.filter((x: any) => exists.find((x: any) => x.name === x.name));
        
            await Promise.all(toDelete.map(async (permission: any) => {
                const query = rolRef.collection('permissions').where('nombre', '==', permission);
                const toDeleteSnapshot = await query.get();
                toDeleteSnapshot.forEach(async doc => await doc.ref.delete());
            }));

            await Promise.all(toAdd.map(async (permission: any) => {
                await rolRef.collection('permissions').add({ name: permission });
            }));

            await Promise.all(toUpdate.map(async (permission: any) => {
                const query = rolRef.collection('permissions').where('name', '==', permission);
                const toUpdateSnapshot = await query.get();
                toUpdateSnapshot.forEach(async doc => await doc.ref.update({ name: permission }));
            }));

            await rolRef.update({ name, description });

            res.json({ id, name, permissions });
        } catch (error) {
            res.status(500).send(error);
        }
    };
    
    export const Delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const rolesRef = db.collection('roles');
            await rolesRef.doc(id.toString()).delete();

            res.json({ id });
        } catch (error) {
            res.status(500).send(error);
        }
    };
}
