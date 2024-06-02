import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticableGuard } from '../shared/guards/authenticable.guard';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';

const routes: Routes = [
    {
        path: '',
        component: ListTasksComponent,
        canActivate: [AuthenticableGuard],
    },
    {
        path: 'create',
        component: EditTaskComponent,
        canActivate: [AuthenticableGuard],
    },
    {
        path: ':id',
        component: EditTaskComponent,
        canActivate: [AuthenticableGuard],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule { }
