import { Component, Inject } from '@angular/core';
import { RegisterDto } from '../../entities/register.entity';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { ServerService } from '../../../shared/services/server.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    public registerDto: RegisterDto = {
        email: '',
    };
    public form: FormGroup;
    public ready: boolean = false;
    public loading: boolean = false;

    constructor(private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private router: Router,
        private server: ServerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<RegisterComponent>
    ) {
        this.form = this.formBuilder.group({});
    }

    public ngOnInit(): void {
        this.init();

        this.ready = true;
    }

    private init(): void {
        this.form = this.formBuilder.group({
            email: [this.data.login?.email || this.registerDto.email, [Validators.required, Validators.email]],
        });
    }

    public async register(): Promise<void> {
        try {
            if (this.form.invalid) {
                this.notificationService.showError('Email field is required');
                return;
            }
            this.loading = true;

            this.registerDto.email = this.form.get('email')?.value;

            await this.server.register(this.registerDto);

            this.notificationService.showSuccess('Registration successfully');
            this.router.navigate(['/']);

            if (this.data.login) {
                this.dialogRef.close();
            }
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }
}
