import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { TitleComponent } from '../ui/title/title.component';
import { NoResultComponent } from '../ui/no-result/no-result.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPlusOutline } from '@ng-icons/material-icons/outline';
import { matEdit, matDelete } from '@ng-icons/material-icons/baseline';
import { User } from '../models/User';
import { UsersService } from '../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { ModalElement } from '../@types/modal-element.type';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TitleComponent,
    NoResultComponent,
    NgIconComponent,
    NgClass,
    SidebarComponent,
    AddUserComponent,
    DeleteUserComponent,
    EditUserComponent,
  ],
  viewProviders: [
    provideIcons({
      matPlusOutline,
      matEdit,
      matDelete,
    }),
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  activeTab = '';
  q = '';

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(q?: string, filterByRole?: string) {
    this.usersService.getAllUsers(q, filterByRole).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.getAllUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });

    const e = document.getElementById(`delete-user-${id}`) as ModalElement;
    e.close();
  }

  changeActiveTab(tab: string) {
    this.activeTab = tab;
    this.getAllUsers('', this.activeTab);
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.q = inputElement.value;
    this.getAllUsers(this.q, this.activeTab);
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

  handleClick() {
    const e = document.getElementById('add-user') as ModalElement;
    e.showModal();
  }

  openDeleteUser(id: number) {
    const e = document.getElementById(`delete-user-${id}`) as ModalElement;
    e.showModal();
  }

  openEditUser(id: number) {
    const e = document.getElementById(`edit-user-${id}`) as ModalElement;
    e.showModal();
  }
}
