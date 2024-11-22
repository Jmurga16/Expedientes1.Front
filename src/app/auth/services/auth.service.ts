import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { JwtTokenDto } from '../models/jwt-token-dto';
import { CreateUserDto } from '../models/create-user-dto';
import { LoginUserDto } from '../models/login-user-dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = environment.apiUrl + '/auth/';


  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {

  }

  public login(request: LoginUserDto): Observable<JwtTokenDto> {
    return this.httpClient.post<JwtTokenDto>(this.authURL + 'login', request).pipe(
      tap(response => {
        console.log(response)
        if (response.token) {
          this.tokenService.setToken(response.token)
        }
      })
    );
  }

  public register(request: CreateUserDto): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'create-user', request);
  }


}
