import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  success(text: string): void {
    Swal.fire({ title: 'Éxito.', text, icon: 'success', confirmButtonText: 'Aceptar' });
  }

  error(text: string): void {
    Swal.fire({ title: 'Error!', text, icon: 'error', confirmButtonText: 'Aceptar' });
  }

  warning(text: string): void {
    Swal.fire({ title: 'Advertencia!', text, icon: 'warning', confirmButtonText: 'Aceptar' });
  }

  confirm(title: string): Promise<boolean> {
    return Swal.fire({
      title,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then(result => result.isConfirmed);
  }

  confirmWarning(title: string, text: string, confirmButtonText: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then(result => result.isConfirmed);
  }
}
