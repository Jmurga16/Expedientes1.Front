import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import { DemandaService } from '../../../modules/demanda/common/services/demanda.service';
import { UsuarioService } from '../../../modules/user/common/services/usuario.service';
import { IAccesoRapido } from './models/acceso-rapido.interface';
import { IIndicador } from './models/indicador.interface';

const SUBTITULOS: Record<string, string> = {
  administrador: 'Estado general de los expedientes del municipio.',
  referente: 'Expedientes cuyo circuito pasa por su área.',
  colaborador: 'Expedientes cuyo circuito pasa por su área.',
  usuario: 'Seguimiento de las demandas que inició.',
};

const ACCESOS: IAccesoRapido[] = [
  { titulo: 'Nueva demanda', descripcion: 'Iniciar un expediente para un reclamo, queja o petición.', icono: 'pi pi-plus-circle', link: '/admin/demanda/create', soloAdmin: false },
  { titulo: 'Bandeja de demandas', descripcion: 'Buscar expedientes, ver su circuito y su historial.', icono: 'pi pi-inbox', link: '/admin/demanda/list', soloAdmin: false },
  { titulo: 'Flujos de trabajo', descripcion: 'Diseñar en BPMN el circuito de cada tipo de trámite.', icono: 'pi pi-share-alt', link: '/admin/workflow/list', soloAdmin: true },
  { titulo: 'Usuarios', descripcion: 'Alta de vecinos, referentes y colaboradores por área.', icono: 'pi pi-users', link: '/admin/user/list', soloAdmin: true },
  { titulo: 'Áreas', descripcion: 'Dependencias municipales que intervienen en los circuitos.', icono: 'pi pi-building', link: '/admin/area/list', soloAdmin: true },
  { titulo: 'Tipologías', descripcion: 'Clasificación de los trámites y sus subtipologías.', icono: 'pi pi-th-large', link: '/admin/tipologia/list', soloAdmin: true },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  nombre = '';
  subtitulo = '';
  accesos: IAccesoRapido[] = [];
  indicadores: IIndicador[] = [
    { titulo: 'Expedientes', icono: 'pi pi-folder', estados: null, total: null },
    { titulo: 'En curso', icono: 'pi pi-clock', estados: [1, 3, 6], total: null },
    { titulo: 'Suspendidos', icono: 'pi pi-pause-circle', estados: [2], total: null },
    { titulo: 'Cerrados', icono: 'pi pi-check-circle', estados: [4, 5, 7], total: null },
  ];

  constructor(
    private tokenService: TokenService,
    private demandaService: DemandaService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    const esAdmin = this.tokenService.isAdmin();
    this.subtitulo = SUBTITULOS[this.tokenService.getCurrentRol()] ?? '';
    this.accesos = ACCESOS.filter(acceso => esAdmin || !acceso.soloAdmin);

    this.usuarioService.getMe().subscribe({
      next: (usuario) => this.nombre = usuario.name ?? ''
    });

    this.demandaService.getResumen().subscribe({
      next: (resumen) => {
        const contar = (estados: number[] | null) => Object.entries(resumen)
          .filter(([estado]) => estados === null || estados.includes(Number(estado)))
          .reduce((total, [, cantidad]) => total + cantidad, 0);
        this.indicadores.forEach(indicador => indicador.total = contar(indicador.estados));
      }
    });
  }
}
