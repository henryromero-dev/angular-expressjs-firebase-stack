import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { AppRoles } from '../const/app-roles.const';

export namespace AuthController {
    export const Register = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            const userSnapshot = await db.collection('users').where('email', '==', email).get();
            if (!userSnapshot.empty) {
                return res.status(400).json({ error: 'Email is already registered' });
            }

            const saltRounds = 10;
            const passwordHash = process.env.REQUIRE_LOGIN_PASSWORD !== 'false' ? await bcrypt.hash(password, saltRounds) : null;

            await db.collection('users').add({
                email,
                passwordHash,
                roleName: AppRoles.CLIENT
            });

            res.status(201).json({ message: 'User registered' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    export const Login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            const userSnapshot = await db.collection('users').where('email', '==', email).get();
            if (userSnapshot.empty) {
                return res.status(400).json({ error: 'Email or password is incorrect' });
            }

            const user: any = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };

            if (process.env.REQUIRE_LOGIN_PASSWORD !== 'false') {
                const match = await bcrypt.compare(password, user.passwordHash);
                if (!match) {
                    return res.status(400).json({ error: 'Email or password is incorrect' });
                }
            }

            delete user.passwordHash;

            const accessToken = sign({user}, <string>process.env.SECRETE_TOKEN, { expiresIn: '24h' });

            res.status(200).json({ message: 'User logged in', accessToken });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    export const Logout = async (req: Request, res: Response) => {
        try {
            res.status(200).json({ message: 'User logged out' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    export const Me = async (req: Request, res: Response) => {
        try {
            const userId = (<any>req)['uId'];

            const userSnapshot = await db.collection('users').doc(userId).get();
            const user = userSnapshot.data();
            if (user) {
                delete user.passwordHash;
                res.status(200).json({ id: userId, ...user });
            } else {
                throw new Error('User not found');
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    export const UpdatePassword = async (req: Request, res: Response) => {
        try {
            if (process.env.REQUIRE_LOGIN_PASSWORD === 'false') {
                return res.status(400).json({ error: 'Password update is disabled' });
            }

            const userId = (<any>req)['uId'];
            const { password, oldPassword } = req.body;

            if (!password || !oldPassword) {
                return res.status(400).json({ error: 'Password is required' });
            }

            const userSnapshot = await db.collection('users').doc(userId).get();
            const user: any = userSnapshot.data();
            const match = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!match) {
                return res.status(400).json({ error: 'Password is incorrect' });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            await db.collection('users').doc(userId).update({
                passwordHash,
            });

            res.status(200).json({ message: 'Password updated' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    export const UpdateInfo = async (req: Request, res: Response) => {
        try {
            const userId = (<any>req)['uId'];
            const { email } = req.body;

            await db.collection('users').doc(userId).update({
                email,
            });

            res.status(200).json({ message: 'Info updated' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
