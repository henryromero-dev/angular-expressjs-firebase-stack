import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(private server: ServerService,
        private router: Router) {
    }

    public logout(): void {
        this.server.logout();

        this.router.navigate(['/account/login']);
    }

    public goTasksList(): void {
        this.router.navigate(['/tasks']);
    }

    get isEditTaskModule(): boolean {
        return this.server.currentModule.startsWith('tasks/');
    }

    get isEditTasksModule(): boolean {
        return this.server.currentModule === 'tasks';
    }
}
