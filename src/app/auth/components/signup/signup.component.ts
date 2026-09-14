import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CreateUserDto } from '../../models/create-user-dto';
import { AuthService } from '../../services/auth.service';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../shared/directives/password-validator.directive';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private notification: NotificationService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), upperCaseValidator(), lowerCaseValidator(), specialCharacterValidator()]],
    });
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    const request: CreateUserDto = this.registerForm.value;

    this.loadingService.show();

    this.authService.register(request)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (response) => {
          this.notification.success(response.message);
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
