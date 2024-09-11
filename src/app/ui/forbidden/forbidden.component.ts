import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrl: './exception-page.component.css',
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  onBtnClick() {
    this.router.navigate(['/login']);
  }
}
