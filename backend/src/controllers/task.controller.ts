import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../entities/task-status.entity';

export namespace TaskController {
    export const Get = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const tasksRef = db.collection('tasks');
            const snapshot = await tasksRef.doc(id.toString()).get();
            const task = <Task>{ id: snapshot.id, ...snapshot.data() };

            task.createdOn = new Date(task.createdOn);
            if (task.updatedOn) {
                task.updatedOn = new Date(task.updatedOn);
            }

            const statusRef = await db.collection('statuses').doc(task.statusId).get();
            task.status = <TaskStatus>statusRef.data();

            if (task.visibility !== '') {
                task.visibility = 'private';
            }

            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    export const List = async (req: Request, res: Response) => {
        try {
            const userId = (<any>req)['uId'];
            let cursor: any = req.query.cursor || null;
            const limit = +(req.query.limit || 3);

            const tasksRef = db.collection('tasks');
            let q = tasksRef.orderBy('createdOn', 'desc')
            .where('visibility', 'in', ['', userId]);

            if (cursor) {
                q = q.startAfter(+cursor);
            }

            q = q.limit(limit)

            const snapshot = await q.get();
            const tasks = <Task[]>snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (tasks.length >= limit) {
                cursor = tasks[tasks.length - 1].createdOn;
            } else {
                cursor = null;
            }

            for (const task of tasks) {
                task.createdOn = new Date(task.createdOn);
                if (task.updatedOn) {
                    task.updatedOn = new Date(task.updatedOn);
                }

                if (task.visibility !== '') {
                    task.visibility = 'private';
                }
            }

            res.status(200).json({
                tasks,
                cursor
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message});
        }
    }

    export const Create = async (req: Request, res: Response) => {
        try {
            const { title, description, statusId } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            } else if (!description) {
                return res.status(400).json({ error: 'Description is required' });
            } else if (!statusId) {
                return res.status(400).json({ error: 'Status is required' });
            }

            const visibility: string = req.body.visibility !== '' ? (<any>req)['uId'] : '';

            const userId = (<any>req)['uId'];

            const taskRef = await db.collection('tasks').add({ title, description, statusId, visibility, updatedOn: null, createdOn: new Date().getTime(), createdBy: userId, updatedBy: null });

            res.json({ id: taskRef.id, ...req.body });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    export const Update = async (req: Request, res: Response) => {
        try {
            const { title, description, statusId } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            } else if (!description) {
                return res.status(400).json({ error: 'Description is required' });
            } else if (!statusId) {
                return res.status(400).json({ error: 'Status is required' });
            }
            const userId = (<any>req)['uId'];
            const id = req.params.id;

            const existsRef = db.collection('tasks');
            const snapshot = await existsRef.doc(id.toString()).get();
            const task = <Task>{ id: snapshot.id, ...snapshot.data() };

            if (task.createdBy !== userId && req.body.visibility !== '') {
                return res.status(403).json({ error: 'You are not allowed to change this visibility' });
            }
       
            const visibility: string = req.body.visibility !== '' ? (<any>req)['uId'] : '';

            const taskRef = db.collection('tasks').doc(id);
            await taskRef.update({ title, description, statusId, visibility, updatedOn: new Date().getTime(), updatedBy: userId });

            res.json({ id, ...req.body });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    export const Delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const taskRef = db.collection('tasks').doc(id);

            await taskRef.delete();

            res.json({ id });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    export const ListStatuses = async (req: Request, res: Response) => {
        try {
            const statusesRef = db.collection('taskStatuses');
            const snapshot = await statusesRef.get();
            const statuses = <TaskStatus[]>snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.status(200).json(statuses);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}
