import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserFormComponent } from './user-form.component';
import { IUsuario } from '../../common/models/usuario.interface';

const USUARIO: IUsuario = {
  id: 7,
  name: 'Ana',
  lastname: 'Vecina',
  dni: '30111222',
  address: 'Calle Falsa 123',
  username: 'ana@demo.test',
  email: 'ana@demo.test',
  roles: ['ROLE_AREA'],
  idArea: 4,
  status: 1
};

describe('UserFormComponent en modo ver', () => {

  let fixture: ComponentFixture<UserFormComponent>;
  let component: UserFormComponent;
  let httpMock: HttpTestingController;

  function montar(datosDeRuta: { readonly?: boolean }) {
    TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [
        HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule,
        ButtonModule, CardModule, DropdownModule, InputTextModule, MultiSelectModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: { snapshot: { data: datosDeRuta }, params: of({ id: 7 }) }
      }]
    });

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne(request => request.url.endsWith('/user/7')).flush(USUARIO);
    httpMock.expectOne(request => request.url.endsWith('/area/activos')).flush([]);
    fixture.detectChanges();
  }

  afterEach(() => httpMock.verify());

  it('deshabilita el formulario pero conserva los datos para guardar', () => {
    montar({ readonly: true });

    expect(component.readonly).toBeTrue();
    expect(component.userForm.disabled).toBeTrue();
    expect(component.userForm.getRawValue()).toEqual(jasmine.objectContaining({
      id: 7,
      name: 'Ana',
      lastname: 'Vecina',
      dni: '30111222',
      email: 'ana@demo.test'
    }));
  });

  it('no muestra Guardar y sale con Volver', () => {
    montar({ readonly: true });

    const botones = Array.from(fixture.nativeElement.querySelectorAll('.footer button'))
      .map(boton => (boton as HTMLElement).textContent?.trim());

    expect(botones).toEqual(['Volver']);
    expect(component.headerTitle).toBe('Detalle de Usuario');
  });

  it('en edicion el formulario sigue habilitado', () => {
    montar({});

    expect(component.readonly).toBeFalse();
    expect(component.userForm.disabled).toBeFalse();

    const botones = Array.from(fixture.nativeElement.querySelectorAll('.footer button'))
      .map(boton => (boton as HTMLElement).textContent?.trim());

    expect(botones).toEqual(['Guardar', 'Salir']);
  });
});
