import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matArticleOutline,
  matDashboardOutline,
  matDevicesOutline,
  matGroupOutline,
  matHistoryEduOutline,
  matLogoutOutline,
} from '@ng-icons/material-icons/outline';
import { LogoComponent } from '../logo/logo.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIconComponent, LogoComponent, RouterModule],
  viewProviders: [
    provideIcons({
      matLogoutOutline,
      matDashboardOutline,
      matArticleOutline,
      matGroupOutline,
      matHistoryEduOutline,
      matDevicesOutline,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  sidebarItems = [
    {
      path: '/dashboard',
      icon: 'matDashboardOutline',
      name: 'Dashboard',
    },
    {
      path: '/devices',
      icon: 'matDevicesOutline',
      name: 'Devices',
    },
    {
      path: '/transactions',
      icon: 'matArticleOutline',
      name: 'Transactions',
    },
    {
      path: '/users',
      icon: 'matGroupOutline',
      name: 'Users',
    },
    // {
    //   path: '/logs',
    //   icon: 'matHistoryEduOutline',
    //   name: 'Logs',
    // },
  ];

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
