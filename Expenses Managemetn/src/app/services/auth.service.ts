import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getStoredToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // In production, this would be an HTTP call to your Node backend
        const user: User = {
          id: this.generateId(),
          email,
          name
        };
        const token = this.generateToken();
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        observer.next({ token, user });
        observer.complete();
      }, 500);
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // In production, this would be an HTTP call to your Node backend
        // For demo, we'll accept any email/password and load existing user or create a new one
        const storedUsers = this.getStoredUsers();
        let user = storedUsers.find(u => u.email === email);
        
        if (!user) {
          user = {
            id: this.generateId(),
            email,
            name: email.split('@')[0]
          };
          storedUsers.push(user);
          localStorage.setItem('allUsers', JSON.stringify(storedUsers));
        }
        
        const token = this.generateToken();
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        
        observer.next({ token, user });
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getCurrentUser(): User | null {
    return this.getStoredUser();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getStoredUsers(): User[] {
    const users = localStorage.getItem('allUsers');
    return users ? JSON.parse(users) : [];
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 15);
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 9);
  }
}
