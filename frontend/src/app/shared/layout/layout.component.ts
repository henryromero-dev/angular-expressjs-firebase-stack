import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ServerService } from '../services/server.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
    constructor(private router: Router,
        private server: ServerService) {
    }

    public ngOnInit(): void {
        if (this.server.currentModule === '') { // No home screen has been defined
            this.router.navigate(['/tasks']);
        }
    }
}
