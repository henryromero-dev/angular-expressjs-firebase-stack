import { Routes } from '@angular/router';
import { AuthenticableGuard } from './shared/guards/authenticable.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [{
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
}, {
    path: '',
    component: LayoutComponent,
    children: [{
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
    }]
}, {
    path: '**',
    redirectTo: 'tasks',
}];
