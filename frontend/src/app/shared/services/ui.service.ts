import { Injectable } from '@angular/core';

declare var window: any;

@Injectable({
    providedIn: 'root'
})
export class UiService {
    public isMobileWidth: boolean = false;

    constructor() {
        this.isMobileWidth = window.innerWidth <= 768;

        addEventListener('resize', () => {
            this.isMobileWidth = window.innerWidth <= 768;
        });
    }
}
