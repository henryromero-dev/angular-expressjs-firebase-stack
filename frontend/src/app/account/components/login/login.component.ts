import { Component } from '@angular/core';
import { LoginDto } from '../../entities/login.entity';
import { RegisterDto } from '../../entities/register.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { ServerService } from '../../../shared/services/server.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    public loginDto: LoginDto = {
        email: '',
    };
    public form: FormGroup;
    public ready: boolean = false;
    public loading: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private router: Router,
        private server: ServerService
    ) {
        this.form = this.formBuilder.group({});
    }

    public ngOnInit(): void {
        this.init();

        this.ready = true;
    }

    private init(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    public async login(): Promise<void> {
        try {
            if (this.form.invalid) {
                this.notificationService.showError('Email field is required');
                return;
            }

            this.loading = true;

            this.loginDto.email = this.form.get('email')?.value;

            await this.server.login(this.loginDto);

            this.notificationService.showSuccess('Welcome');

            this.router.navigate(['/']);
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }
}
