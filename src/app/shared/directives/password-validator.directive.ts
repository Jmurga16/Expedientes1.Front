import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function upperCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        return !hasUpperCase ? { upperCase: true } : null;
    }
}

export function lowerCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasLowerCase = /[a-z]+/.test(value);

        return !hasLowerCase ? { lowerCase: true } : null;
    }
}

export function numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasNumeric = /[0-9]+/.test(value);

        return !hasNumeric ? { numeric: true } : null;
    }
}

export function specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasSpecialCharacter = /[!\"·$%&/()=¿¡?'_:;,|@#€*+.]+/.test(value);

        return !hasSpecialCharacter ? { specialCharacter: true } : null;
    }
}

export function createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        return !passwordValid ? { passwordStrength: true } : null;
    }
}