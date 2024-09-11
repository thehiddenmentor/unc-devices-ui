import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { API_URL } from '../utils/environment.util';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private resource = '/categories';

  constructor(private http: HttpClient) {}

  createCategory(category: Partial<Category>) {
    return this.http.post<Category>(API_URL + this.resource, category);
  }

  getAllCategories() {
    return this.http.get<Category[]>(API_URL + this.resource);
  }
}
