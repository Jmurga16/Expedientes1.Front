import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'steptask'
})
export class StepTaskPipe implements PipeTransform {
  private estados = [
    { id: 0, nombre: 'Inicio' },
    { id: 1, nombre: 'Receptada' },
    { id: 2, nombre: 'Suspendido' },
    { id: 3, nombre: 'En tratamiento' },
    { id: 4, nombre: 'Cerrado y Resuelto' },
    { id: 5, nombre: 'Cerrado sin Resolución' },
    { id: 6, nombre: 'Pendiente' },
    { id: 7, nombre: 'Finalizado' }
  ];

  transform(value: number): string {
    const estado = this.estados.find(e => e.id === value);
    return estado ? estado.nombre : 'Desconocido';
  }
}