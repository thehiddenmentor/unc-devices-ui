import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { API_URL } from '../utils/environment.util';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  private resource = '/users';

  createUser(user: Partial<User>) {
    return this.http.post<User>(API_URL + this.resource, user);
  }

  getAllUsers(q?: string, filterByRole?: string) {
    return this.http.get<User[]>(
      API_URL +
        this.resource +
        `?q=${q || ''}&filterByRole=${filterByRole || ''}`
    );
  }

  getOneUser(id: number) {}

  updateUser(id: number, user: Partial<User>) {
    return this.http.patch<User>(API_URL + this.resource + `/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(API_URL + this.resource + `/${id}`);
  }
}
