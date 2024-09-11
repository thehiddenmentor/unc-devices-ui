import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { TitleComponent } from '../ui/title/title.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matFilter1Outline,
  matPlusOutline,
  matSearchOutline,
  matDownloadOutline,
} from '@ng-icons/material-icons/outline';
import { NgClass } from '@angular/common';
import { TransactionsService } from '../services/transactions.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Transaction } from '../models/Transaction';
import { NoResultComponent } from '../ui/no-result/no-result.component';
import { ModalElement } from '../@types/modal-element.type';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    SidebarComponent,
    TitleComponent,
    NgIconComponent,
    NgClass,
    NoResultComponent,
    AddTransactionComponent,
    ViewTransactionComponent,
  ],
  viewProviders: [
    provideIcons({
      matPlusOutline,
      matFilter1Outline,
      matSearchOutline,
      matDownloadOutline,
    }),
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  activeTab = '';
  q = '';
  transactions: Transaction[] = [];
  selectedPeriod: string = 'day'; // Initialize selected period

  constructor(
    private transactionsService: TransactionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTransactions();
  }

  setSelectedPeriod(period: string) {
    this.selectedPeriod = period; // Manually update the selected period
  }

  openModal() {
    const modal = document.getElementById('period-modal') as HTMLDialogElement;
    modal.showModal(); // Open the modal
  }

  closeModal() {
    const modal = document.getElementById('period-modal') as HTMLDialogElement;
    modal.close(); // Close the modal
  }

  confirmPeriod() {
    this.closeModal(); // Close the modal after confirming

    // Call the downloadPdf method with the selected period
    this.transactionsService.downloadPdf(this.selectedPeriod);
  }

  getAllTransactions(q?: string, status?: string) {
    this.transactionsService.getAllTransactions(q, status).subscribe({
      next: (res) => {
        this.transactions = res;
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  private handleHttpError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        this.router.navigate(['/login']);
        break;
      case 403:
        this.router.navigate(['/forbidden']);
        break;
      default:
        this.router.navigate(['/server-error']);
    }
  }

  changeActiveTab(tab: string) {
    this.activeTab = tab;
    this.getAllTransactions(this.q, this.activeTab);
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.q = inputElement.value;
    this.getAllTransactions(this.q);
  }
  handleClick() {
    const e = document.getElementById('add-transaction') as ModalElement;
    e.showModal();
  }

  viewTransaction(id: number) {
    const e = document.getElementById(`view-transaction-${id}`) as ModalElement;
    e.showModal();
  }
}
