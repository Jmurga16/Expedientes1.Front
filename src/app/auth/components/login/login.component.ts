import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {

  }

  onSubmit() {
    console.log(this.loginForm.value);

    if (this.loginForm.valid) {

      const dto = new LoginUserDto(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
      this.authService.login(dto).subscribe({
        next: (response: any) => {
          this.router.navigate(['/admin']);
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: 'Credenciales Incorrectas ',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }
      });

    }
  }


}
