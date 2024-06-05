import { Component, OnInit } from '@angular/core';
import { TaskDto } from '../../entities/task.entity';
import { ServerService } from '../../../shared/services/server.service';
import { TaskStatusDto } from '../../entities/task-status.entity';
import { FadeInAnimation } from '../../../shared/animations/animations';
import { Router } from '@angular/router';
import { UiService } from '../../../shared/services/ui.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
    selector: 'app-list-tasks',
    templateUrl: './list-tasks.component.html',
    styleUrl: './list-tasks.component.scss',
    animations: [FadeInAnimation('300ms')]
})
export class ListTasksComponent implements OnInit {
    public tasks: TaskDto[] = [];
    private cursor: string | null = null;
    private limit: number = 10;
    public statuses: TaskStatusDto[] = [];
    public ready: boolean = false;
    public loading: boolean = false;
    public isListEmpty: boolean = false;
    public eof: boolean = false;

    constructor(private server: ServerService,
        private router: Router,
        public ui: UiService,
        private notificationService: NotificationService) { }

    public async ngOnInit(): Promise<void> {
        await Promise.all([
            this.getTaskStatuses(),
            this.getTasks()
        ]).then(() => this.ready = true);
    }

    public async getTasks(): Promise<void> {
        try {
            this.loading = true;
            const { tasks, cursor } = await this.server.getTasks({ cursor: this.cursor || '', limit: this.limit });
        
            this.isListEmpty = tasks.length === 0 && !this.cursor;
        
            this.tasks = [...this.tasks, ...tasks];
            this.cursor = cursor;

            if (!cursor) {
                this.eof = true;
            }
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }

    private async getTaskStatuses(): Promise<void> {
        try {
            this.statuses = await this.server.getTaskStatuses();
            console.log(this.statuses);
        } catch (ex: any) {
            console.error(ex);
        }
    }

    public getStatusById(id: string): TaskStatusDto {
        return this.statuses.find(status => status.id === id) || {
            id: '',
            name: 'unknown',
            description: 'Unknown'
        };
    }

    public createTask(): void {
        this.router.navigate(['/tasks', 'create']);
    }

    public editTask(id: string): void {
        this.router.navigate(['/tasks', id]);
    }

    public async deleteTask(id: string): Promise<void> {
        try {
            this.loading = true;

            await this.server.deleteTask(id);

            this.tasks = this.tasks.filter(task => task.id !== id);
            this.notificationService.showSuccess('Task deleted');
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }

    public getTaskMidDescription(task: TaskDto, length: number = 50): string {
        return task.description.length > length ? task.description.substr(0, length) + '...' : task.description;
    }
}
