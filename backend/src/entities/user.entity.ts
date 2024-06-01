import { Role } from './role.entity';

export interface User {
    id: string; 
    email: string; 
    username: string;
    password: string;
    roles: Role[];
}
