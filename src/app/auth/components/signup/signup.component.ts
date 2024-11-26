import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserDto } from '../../models/create-user-dto';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { lowerCaseValidator, specialCharacterValidator, upperCaseValidator } from '../../../shared/directives/password-validator.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
    let request = this.registerForm.value as CreateUserDto;

    if (this.registerForm.valid) {

      this.authService.register(request).subscribe({
        next: (response: any) => {
          console.log(response)
          Swal.fire({
            title: 'Éxito.',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          this.router.navigate(['/auth/login']);
        },
        error: (error: any) => {
          console.error(error)
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
      });
    }
  }

}
