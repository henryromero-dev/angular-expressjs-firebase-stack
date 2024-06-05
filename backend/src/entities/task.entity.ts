import { TaskStatus } from "./task-status.entity";

export interface Task {
    id: string;
    title: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
    createdBy: string;
    updatedBy: string;
    statusId: string;
    status: TaskStatus;
    visibility: string;
}
