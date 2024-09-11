import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { API_URL } from '../utils/environment.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private resource = '/auth/';

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(
      API_URL + this.resource + 'login',
      loginRequest
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
}
