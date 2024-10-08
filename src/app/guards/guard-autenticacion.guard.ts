import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

export const guardAutenticacionGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.devolverUsuarioLogueado().pipe(
    map(usuario => {
      if (usuario) {
        return true;
      } else {
        Swal.fire({
          position: "center",
          icon: 'warning',
          title: 'Acceso denegado',
          text: 'Para disfrutar de nuestros juegos, logueate',
          showConfirmButton: false,
          timer: 1500
        });
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
