import { Injectable } from '@angular/core';
import { UserDto } from '../entities/user.entity';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../account/entities/login.entity';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';
import { CacheService } from './cache.service';
import { TaskDto } from '../../tasks/entities/task.entity';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    private _accessToken: string = '';
    private user: UserDto | null = null;
    public currentModule: string = '';

    constructor(private http: HttpClient,
        private notificationService: NotificationService,
        private cache: CacheService,
        private router: Router
    ) { 
        this.getUserFromToken();

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log(event.url.split('/').slice(1).join('/'));
                this.currentModule = event.url.split('/').slice(1).join('/');
            }
        });
    }

    public async register(register: any): Promise<void> {
        try {
            const res = await firstValueFrom(this.http.post(environment.API_URL + '/api/register', register))
            .catch((ex: any) => {
                this.handleError(ex);
            }) as any;

            console.log(res);
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async login(login: LoginDto): Promise<void> {
        try {
            const res = await firstValueFrom(this.http.post(environment.API_URL + '/api/login', login))
            .catch((ex: any) => {
                this.handleError(ex);
            }) as any;

            if (!res.accessToken) {
                throw new Error(res.error);
            }

            localStorage.setItem('accessToken', res.accessToken);
            this.getUserFromToken();
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public logout(): void {
        localStorage.removeItem('accessToken');
        this.user = null;
    }

    public async getTasks(): Promise<any> {
        try {
            const res = await firstValueFrom(this.http.get(environment.API_URL + '/api/tasks', {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            })).catch((ex: any) => {
                this.handleError(ex);
            });

            return res;
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async getTaskStatuses(): Promise<any> {
        try {
            if (this.cache.has('taskStatuses')) {
                return this.cache.get('taskStatuses');
            }

            const res = await firstValueFrom(this.http.get(environment.API_URL + '/api/task-statuses', {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            })).catch((ex: any) => {
                this.handleError(ex);
            });

            this.cache.set('taskStatuses', res);

            return res;
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async getTaskById(id: string): Promise<any> {
        try {
            const res = await firstValueFrom(this.http.get(environment.API_URL + `/api/tasks/${id}`, {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            })).catch((ex: any) => {
                this.handleError(ex);
            });

            return res;
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async createTask(task: TaskDto): Promise<string> {
        try {
            const res = <TaskDto>await firstValueFrom(this.http.post(environment.API_URL + '/api/tasks', task, {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            }));

            return res.id;
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async updateTask(id: string, task: TaskDto): Promise<void> {
        try {
            await firstValueFrom(this.http.put(environment.API_URL + `/api/tasks/${id}`, task, {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            })).catch((ex: any) => {
                this.handleError(ex);
            });
        } catch (ex) {
            console.log(ex);
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    public async deleteTask(id: string): Promise<void> {
        try {
            await firstValueFrom(this.http.delete(environment.API_URL + `/api/tasks/${id}`, {
                headers: {
                    authorization: `Bearer ${this._accessToken}`
                }
            })).catch((ex: any) => {
                this.handleError(ex);
            });
        } catch (ex) {
            this.notificationService.showError(<string>ex);
            throw ex;
        }
    }

    private getUserFromToken(): void {
        try {
            this._accessToken = localStorage.getItem('accessToken') || '';
            if (this._accessToken) {
                const decodedToken = jwtDecode(this._accessToken) as any;
                this.user = decodedToken.user;
            }
        } catch (ex: any) {
            console.error(ex)
        }
    }

    private handleError(ex: any): void {
        switch (ex.status) {
            case 400:
                if (ex.error.error) {
                    throw ex.error.error;
                }
                throw ex;
            case 401:
                throw ex;
            case 403:
                if (ex.error.error) {
                    throw ex.error.error;
                }
                throw ex;
            case 500:
                throw ex;
            default:
                console.error(ex);
        }
    }

    get isAuthenticated(): boolean {
        console.log(this.user);
        return this.user ? true : false;
    }
}
