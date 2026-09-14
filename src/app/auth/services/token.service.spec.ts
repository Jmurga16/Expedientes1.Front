import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

function tokenCon(payload: object): string {
  const base64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `cabecera.${base64}.firma`;
}

function dentroDeUnaHora(): number {
  return Math.floor(Date.now() / 1000) + 3600;
}

describe('TokenService', () => {

  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('devuelve el rol de mayor precedencia cuando el token trae varios', () => {
    service.setToken(tokenCon({ roles: ['ROLE_ADMIN', 'ROLE_USER'], exp: dentroDeUnaHora() }));

    expect(service.getCurrentRol()).toBe('administrador');
  });

  it('respeta la precedencia referente sobre colaborador y usuario', () => {
    service.setToken(tokenCon({ roles: ['ROLE_USER', 'ROLE_COLAB', 'ROLE_AREA'], exp: dentroDeUnaHora() }));

    expect(service.getCurrentRol()).toBe('referente');
  });

  it('devuelve usuario cuando ese es el unico rol', () => {
    service.setToken(tokenCon({ roles: ['ROLE_USER'], exp: dentroDeUnaHora() }));

    expect(service.getCurrentRol()).toBe('usuario');
  });

  it('devuelve vacio sin token y no rompe con un token invalido', () => {
    expect(service.getCurrentRol()).toBe('');

    service.setToken('no-es-un-jwt');
    expect(service.getCurrentRol()).toBe('');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('un token vencido no autentica', () => {
    service.setToken(tokenCon({ roles: ['ROLE_ADMIN'], exp: Math.floor(Date.now() / 1000) - 60 }));

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.isAdmin()).toBeFalse();
  });

  it('isAdmin solo es cierto con ROLE_ADMIN vigente', () => {
    service.setToken(tokenCon({ roles: ['ROLE_AREA'], exp: dentroDeUnaHora() }));
    expect(service.isAdmin()).toBeFalse();

    service.setToken(tokenCon({ roles: ['ROLE_ADMIN'], exp: dentroDeUnaHora() }));
    expect(service.isAdmin()).toBeTrue();
  });
});
