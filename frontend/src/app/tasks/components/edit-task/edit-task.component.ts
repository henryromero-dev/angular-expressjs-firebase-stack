import { Component, OnInit } from "@angular/core";
import { ServerService } from "../../../shared/services/server.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../../shared/services/notification.service";
import { TaskDto } from "../../entities/task.entity";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TaskStatusDto } from "../../entities/task-status.entity";
import { FadeInAnimation } from "../../../shared/animations/animations";

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrl: './edit-task.component.scss',
    animations: [FadeInAnimation('300ms')]
})
export class EditTaskComponent implements OnInit {
    public task: TaskDto = {} as TaskDto;
    public taskId: string | null = null;
    public form: FormGroup | null = null;
    public statuses: TaskStatusDto[] = [];
    public ready: boolean = false;
    public loading: boolean = false;

    constructor(private server: ServerService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService) {
    }


    async ngOnInit(): Promise<void> {
        await this.getTaskStatuses();

        const id = (<any>this.route.snapshot.params).id;
        if (id) {
            this.taskId = id;
            await this.loadTask();

            if (!this.task.statusId || !this.statuses.find((status) => status.id === this.task.statusId)) {
                this.task.statusId = this.defaultStatus?.id;
            }
        } else {
            this.task = {
                title: '',
                description: '',
                statusId: this.defaultStatus?.id,
            } as TaskDto;
        }

        this.initForm();
        this.ready = true;
    }

    private initForm(): void {
        this.form = new FormGroup({
            title: new FormControl(this.task.title || '', Validators.required),
            description: new FormControl(this.task.description || '', Validators.required),
            statusId: new FormControl(this.task.statusId || this.defaultStatus?.id, Validators.required),
            visibility: new FormControl(this.task.visibility || '')
        });
    }

    private async loadTask(): Promise<void> {
        try {
            this.loading = true;
            this.task = await this.server.getTaskById(<string>this.taskId);
        } catch (ex) {
            this.notificationService.showError(<string>ex);
        } finally {
            this.loading = false;
        }
    }

    private async getTaskStatuses(): Promise<void> {
        try {
            this.statuses = await this.server.getTaskStatuses();
        } catch (ex: any) {
            console.error(ex);
        }
    }

    public async saveTask(): Promise<void> {
        try {
            if (!this.form || this.form.invalid) {
                this.notificationService.showError('Please fill in all required fields');
                return;
            }

            const body = {
                ...this.task,
                title: this.form.value.title,
                description: this.form.value.description,
                statusId: this.form.value.statusId,
                visibility: this.form.value.visibility || ''
            }

            this.loading = true;
            if (this.taskId) {
                await this.server.updateTask(this.taskId, body);
            } else {
                this.taskId = await this.server.createTask(body);
                this.router.navigate(['/tasks', this.taskId]);
            }

            this.notificationService.showSuccess('Task saved successfully');
        } catch (ex) {
            this.notificationService.showError(<string>ex);
        } finally {
            this.loading = false;
        }
    }

    public cancel(): void {
        this.router.navigate(['/tasks']);
    }

    private get defaultStatus(): TaskStatusDto {
        return this.statuses.find((status) => status.name === 'new') || {} as TaskStatusDto;
    }
}
