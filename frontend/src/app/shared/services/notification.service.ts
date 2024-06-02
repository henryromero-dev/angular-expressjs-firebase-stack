import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private _snackBar: MatSnackBar) { }

    public showError(message: string): void {
        this._snackBar.open(message, 'Ok', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
    }

    public showSuccess(message: string): void {
        this._snackBar.open(message, 'Ok', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }
}
