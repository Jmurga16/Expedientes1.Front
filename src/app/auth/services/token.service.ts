import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly payloadEmail = "email"
  private readonly payloadRol = "roles"

  constructor() { }

  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return null;
    }
  }

  public logOut(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    return this.getToken() != null;
  }

  public isAdmin(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    const payload = token!.split(".")[1];
    const payloadDecoded = atob(payload);

    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;
    if (roles.indexOf('ROLE_ADMIN') < 0) {
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false
    }

    const payload = JSON.parse(atob(token!.split(".")[1]));
    const exp = payload.exp * 1000

    return Date.now() < exp;

  }

  getDataJWT(campo: string): string {
    const token = this.getToken()

    if (!token) {
      return ''
    }

    var dataToken = JSON.parse(atob(token.split('.')[1]));

    return dataToken[campo]
  }

  getEmail() {
    return this.getDataJWT("email");
  }

  getRoles(): string {
    return this.getDataJWT(this.payloadRol);
  }


}
