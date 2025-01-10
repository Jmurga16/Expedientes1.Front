import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginUserDto } from '../../models/login-user-dto';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {

    if (this.loginForm.valid) {

      const dto = new LoginUserDto(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
      this.authService.login(dto).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Credenciales Incorrectas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
      });
    }
  }

}
