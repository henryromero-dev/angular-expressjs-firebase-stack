import express, { Router } from 'express';
import { AuthMiddleware } from './middleware/auth.middleware';
import { PermissionsMiddleware } from './middleware/permissions.middleware';
import { AppPermissions } from './const/app-permissions.const';
import { RoleController } from './controllers/role.controller';
import { AuthController } from './controllers/auth.controller';
import { TaskController } from './controllers/task.controller';

export const Routes = (router: Router) => {
    router.post('/api/register', AuthController.Register);
    router.post('/api/login', AuthController.Login);
    router.post('/api/logout', AuthMiddleware, AuthController.Logout);
    router.get('/api/me', AuthMiddleware, AuthController.Me);
    router.put('/api/me/update', AuthMiddleware, AuthController.UpdateInfo);
    router.put('/api/me/updatePassword', AuthMiddleware, AuthController.UpdatePassword);

    router.get('/api/roles', AuthMiddleware, PermissionsMiddleware(AppPermissions.READ_ROLE), RoleController.List);
    router.get('/api/roles/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.READ_ROLE), RoleController.Get);
    router.post('/api/roles', AuthMiddleware, PermissionsMiddleware(AppPermissions.CREATE_ROLE), RoleController.Create);
    router.put('/api/roles/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.UPDATE_ROLE), RoleController.Update);
    router.delete('/api/roles/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.DELETE_ROLE), RoleController.Delete);

    router.get('/api/tasks', AuthMiddleware, PermissionsMiddleware(AppPermissions.READ_TASK), TaskController.List);
    router.get('/api/tasks/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.READ_TASK), TaskController.Get);
    router.post('/api/tasks', AuthMiddleware, PermissionsMiddleware(AppPermissions.CREATE_TASK), TaskController.Create);
    router.put('/api/tasks/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.UPDATE_TASK), TaskController.Update);
    router.delete('/api/tasks/:id', AuthMiddleware, PermissionsMiddleware(AppPermissions.DELETE_TASK), TaskController.Delete);
};
