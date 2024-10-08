import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from "@angular/forms";

export function alMenosUnJuegoSeleccionado(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormGroup) {
      const controls = control.controls;

      for (const controlKey in controls) {
        if (controls[controlKey].value === true) {
          return null;
        }
      }
    }
    return { ningunJuegoSeleccionado: true };
  };
}
