import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';

const ROL_PRECEDENCIA = [
  ['ROLE_ADMIN', 'administrador'],
  ['ROLE_AREA', 'referente'],
  ['ROLE_COLAB', 'colaborador'],
  ['ROLE_USER', 'usuario'],
] as const;

interface JwtPayload {
  sub?: string;
  email?: string;
  roles?: string[];
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

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

  public isAuthenticated(): boolean {
    const exp = this.getPayload()?.exp;
    return exp != null && Date.now() < exp * 1000;
  }

  public isAdmin(): boolean {
    return this.isAuthenticated() && this.getRoles().includes('ROLE_ADMIN');
  }

  public getEmail(): string {
    return this.getPayload()?.email ?? '';
  }

  public getRoles(): string[] {
    return this.getPayload()?.roles ?? [];
  }

  public getCurrentRol(): string {
    const roles = this.getRoles();
    return ROL_PRECEDENCIA.find(([rol]) => roles.includes(rol))?.[1] ?? '';
  }

  private getPayload(): JwtPayload | null {
    const payload = this.getToken()?.split('.')[1];
    if (!payload) {
      return null;
    }

    try {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }
}
