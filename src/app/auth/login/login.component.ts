import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../ui/logo/logo.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogoComponent, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.onReset();
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        switch (err.status) {
          case 400:
            console.log(err.message);
            break;
          case 401:
            this.form.get('username')?.setErrors({ incorrect: true });
            break;
          default:
            this.router.navigate(['/server-error']);
        }

        this.loading = false;
      },
    });
  }

  onReset() {
    this.form.reset();
  }
}
