import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import { TasksRoutingModule } from './tasks.router';
import { MaterialModule } from '../material.module';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ListTasksComponent, EditTaskComponent],
    imports: [
        CommonModule,
        TasksRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class TasksModule { }
