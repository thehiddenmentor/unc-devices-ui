import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { API_URL } from '../utils/environment.util';
import { Department } from '../models/Department';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private resource = '/departments';

  constructor(private http: HttpClient) {}

  createDepartment(department: Partial<Department>) {
    return this.http.post<Department>(API_URL + this.resource, department);
  }

  getAllDepartments() {
    return this.http.get<Department[]>(API_URL + this.resource);
  }
}
