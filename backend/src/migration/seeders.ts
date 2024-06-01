import { db } from "../config/firebase.config";
import { AppPermissions } from "../const/app-permissions.const";

export namespace Seeders {
    export const LoadRoles = async () => {
        try {
            const roles = [{ 
                name: 'client', 
                permissions: [AppPermissions.READ_TASK, AppPermissions.CREATE_TASK, AppPermissions.UPDATE_TASK, AppPermissions.DELETE_TASK]
            }, {
                name: 'admin',
                permissions: AppPermissions.ALL
            }];
    
            for (const role of roles) {
                const roleSnapshot = await db.collection('roles').where('name', '==', role.name).get();
                if (roleSnapshot.empty) {
                    await db.collection('roles').add(role);
                }
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };
    export const LoadTaskStatuses = async () => {
        try {
            const taskStatuses = [{ 
                name: 'new', 
                description: 'New'
            }, {
                name: 'in-progress',
                description: 'In Progress'
            }, {
                name: 'merge-request',
                description: 'Merge Request'
            }, {
                name: 'unit-test',
                description: 'Unit Test'
            }, {
                name: 'in-testing',
                description: 'In Testing'
            }, {
                name: 'tested',
                description: 'Tested'
            }, {
                name: 'done',
                description: 'Done'
            }, {
                name: 'canceled',
                description: 'Canceled'
            }];
    
            for (const taskStatus of taskStatuses) {
                const taskStatusesnapshot = await db.collection('taskStatuses').where('name', '==', taskStatus.name).get();
                if (taskStatusesnapshot.empty) {
                    await db.collection('taskStatuses').add(taskStatus);
                }
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };
}
