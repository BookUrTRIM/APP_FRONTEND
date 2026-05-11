import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginDTO, SignupDTO } from '../../../core/models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
  currentToken$ = this.currentTokenSubject.asObservable();

  login(dto: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', dto).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  signup(dto: SignupDTO): Observable<any> {
    return this.http.post('/auth/signup', dto);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this.currentTokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthentication(response: AuthResponse) {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_role', response.role);
    this.currentTokenSubject.next(response.access_token);
    if (response.role === 'provider') {
      this.router.navigate(['/pro']);
    } else {
      this.router.navigate(['/client']);
    }
  }
}
