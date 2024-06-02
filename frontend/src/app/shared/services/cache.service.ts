import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private map: Map<string, any> = new Map<string, any>();

    constructor() { }

    public get<T>(key: string): T {
        try {
            if (!key?.length) {
                return null as any;
            }

            const cache = localStorage.getItem(key);
            if (cache) {
                return JSON.parse(cache) as T;
            }
            return this.map.get(key) as T;
        } catch (ex) {
            // avoid ssr
            return null as any;
        }
    }

    public set<T>(key: string, value: T): void {
        try {
            if (!key?.length) {
                return;
            }

            localStorage.setItem(key, JSON.stringify(value));
            this.map.set(key, value);
        } catch (ex) {
            // avoid ssr
        }
    }

    public has(key: string): boolean {
        try {
            if (!key?.length) {
                return false;
            }
            
            const value = localStorage.getItem(key);
            return value !== 'undefined' && value !== null || this.map.has(key);
        } catch (ex) {
            // avoid ssr
            return false;
        }
    }

    public remove(key: string): void {
        try {
            localStorage.removeItem(key);
            this.map.delete(key);
        } catch (ex) {
            // avoid ssr
        }
    }
}
