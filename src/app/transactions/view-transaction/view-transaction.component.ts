import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/Transaction';
import { TransactionsService } from '../../services/transactions.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalElement } from '../../@types/modal-element.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css',
})
export class ViewTransactionComponent {
  @Input() transaction!: Transaction;
  @Output() success = new EventEmitter<void>();

  constructor(
    private transactionsService: TransactionsService,
    private router: Router
  ) {}

  markAsReturned() {
    this.transactionsService.markAsReturned(this.transaction.id).subscribe({
      next: (res) => {
        const e = document.getElementById(
          `view-transaction-${this.transaction.id}`
        ) as ModalElement;
        e.close();
        this.success.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  isReturned() {
    if (this.transaction.createdAt === this.transaction.updatedAt) {
      return;
    }

    return this.transaction.updatedAt;
  }

  private handleHttpError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        console.log(error);
        break;
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
}
