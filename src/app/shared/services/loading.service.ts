import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private activeRequests = 0;
    public isLoading$ = new BehaviorSubject<boolean>(false);

    show(): void {
        this.activeRequests++;
        this.updateLoadingState();
    }

    hide(): void {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.updateLoadingState();
    }

    handleRequest(action: 'increment' | 'decrement'): void {
        this.activeRequests = action === 'increment' ? this.activeRequests + 1 : Math.max(0, this.activeRequests - 1);
        this.updateLoadingState();
    }

    private updateLoadingState(): void {
        this.isLoading$.next(this.activeRequests > 0);
    }
}