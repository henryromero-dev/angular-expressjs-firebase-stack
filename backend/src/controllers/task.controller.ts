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

            const statusRef = await db.collection('statuses').doc(task.statusId).get();
            task.status = <TaskStatus>statusRef.data();

            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    export const List = async (req: Request, res: Response) => {
        try {
            const page = <number>(req.query.page || 1);
            const pageSize = <number>(req.query.pageSize || 10);
            const offset = (page - 1) * pageSize;

            const tasksRef = db.collection('tasks');
            const snapshot = await tasksRef.limit(pageSize).offset(offset).get();
            const tasks = <Task[]>snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            for (const task of tasks) {
                task.createdOn = new Date(task.createdOn);
                if (task.updatedOn) {
                    task.updatedOn = new Date(task.updatedOn);
                }
            }

            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error });
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

            const userId = (<any>req)['uId'];

            const taskRef = await db.collection('tasks').add({ title, description, statusId, updatedOn: null, createdOn: new Date().getTime(), createdBy: userId, updatedBy: null });

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

            const taskRef = db.collection('tasks').doc(id);
            await taskRef.update({ title, description, statusId, updatedOn: new Date().getTime(), updatedBy: userId });

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
}
