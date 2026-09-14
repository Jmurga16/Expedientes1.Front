import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginUserDto } from '../../models/login-user-dto';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    this.loadingService.show();

    const dto: LoginUserDto = this.loginForm.value;

    this.authService.login(dto)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: () => this.router.navigate(['/admin'])
      });
  }
}
