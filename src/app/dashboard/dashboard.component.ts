import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { TitleComponent } from '../ui/title/title.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matHistoryOutline,
  matPlusOutline,
} from '@ng-icons/material-icons/outline';
import { Router, RouterModule } from '@angular/router';
import { DevicesStatusCount } from '../models/devices-status-count';
import { DevicesService } from '../services/devices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NoResultComponent } from '../ui/no-result/no-result.component';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/Transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    TitleComponent,
    NgIconComponent,
    RouterModule,
    NoResultComponent,
  ],
  viewProviders: [
    provideIcons({
      matPlusOutline,
      matHistoryOutline,
    }),
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  devicesInfo!: DevicesStatusCount;
  transactions: Transaction[] = [];
  totalDevice = 0;

  constructor(
    private devicesService: DevicesService,
    private transactionsService: TransactionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDevicesStatusCount();
    this.getAllTransactions();
  }

  getDevicesStatusCount() {
    this.devicesService.getDevicesStatusCount().subscribe({
      next: (res) => {
        this.devicesInfo = res;
        this.totalDevice = this.calculateTotalDevices(res);
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  calculateTotalDevices(devicesStatusCount: DevicesStatusCount): number {
    return (
      devicesStatusCount.AVAILABLE +
      devicesStatusCount.NOT_AVAILABLE +
      devicesStatusCount.MISSING +
      devicesStatusCount.DEFECTIVE
    );
  }

  getAllTransactions(q?: string, status?: string) {
    this.transactionsService.getAllTransactions(q, status).subscribe({
      next: (res) => {
        this.transactions = res.slice(0, 5);
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
}
