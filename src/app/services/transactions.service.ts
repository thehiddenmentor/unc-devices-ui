import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../utils/environment.util';
import { Transaction } from '../models/Transaction';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private resource = '/transactions';

  constructor(private http: HttpClient) {}

  downloadPdf(period?: string) {
    return this.http
      .get(API_URL + '/pdf/download' + `?period=${period || ''}`, {
        responseType: 'blob',
      })
      .subscribe((response: Blob) => {
        saveAs(response, 'downloaded.pdf');
      });
  }

  createTransaction(transaction: Partial<Transaction>) {
    return this.http.post<Transaction>(API_URL + this.resource, transaction);
  }

  getAllTransactions(q?: string, status?: string) {
    return this.http.get<Transaction[]>(
      API_URL + this.resource + `?q=${q || ''}&status=${status}`
    );
  }

  updateTransaction(id: number, transaction: Partial<Transaction>) {
    return this.http.patch<Transaction>(
      API_URL + this.resource + `/${id}`,
      transaction
    );
  }

  markAsReturned(id: number) {
    return this.http.patch<Transaction>(
      API_URL + this.resource + `/${id}/mark-as-returned`,
      {}
    );
  }

  deleteTransaction(id: number) {
    return this.http.delete(API_URL + this.resource + `/${id}`);
  }
}
