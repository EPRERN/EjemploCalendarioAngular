import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ErrorKeys, FormFieldKeys, LanguageModel } from '../Models';

/**
 * Valida el campo de fecha de un formulario
 * @param language Lenguaje seleccionado del calendario.
 * @returns Null si la fecha es correcta o un mensaje de error si no.
 */
export function dateValidation(language: LanguageModel): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value as string;
    if (!value || value.length === 0) {
      return null;
    }

    //comprobamos formato de la fecha dd/mm/yyyy
    const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;
    if (!dateRegex.test(value)) {
      return {
        dateFormatInvalid: {
          message: language.errorMessages[ErrorKeys.DateFormatInvalid],
        },
      };
    }

    return null;
  };
}

/**
 * Valida la fecha de inicio del formulario.
 * @param language Lenguaje seleccionado del calendario.
 * @returns Null si la fecha es correcta o un mensaje de error si no.
 */
export function startDateValidation(language: LanguageModel): ValidatorFn {
  return (control: AbstractControl) => {
    const value = <string>control.value;

    if (value === '' || value == null || value == undefined) {
      return {
        startDateRequired: {
          message: language.errorMessages[ErrorKeys.StartDateRequired],
        },
      };
    }

    if (isValidDate(value) === false) {
      return {
        startDateInvalid: {
          message: language.errorMessages[ErrorKeys.DateInvalid],
        },
      };
    }

    return null;
  };
}

/**
 * Valida la hora de la fecha de inicio.
 * @param language Lenguaje seleccionado del calendario.
 * @returns Null si la fecha es correcta o un mensaje de error si no.
 */
export function startTimeValidation(language: LanguageModel): ValidatorFn {
  return (control: AbstractControl) => {
    const valor = <string>control.value;

    if (valor === '' || valor == null || valor == undefined) {
      return {
        startTimeRequired: {
          message: language.errorMessages[ErrorKeys.StartTimeRequired],
        },
      };
    }

    // Expresión regular para verificar el formato de 24 horas (HH:mm)
    const formatoHoraRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    const isValidTime = formatoHoraRegex.test(valor);

    if (!isValidTime) {
      return {
        timeInvalid: {
          message: language.errorMessages[ErrorKeys.TimeInvalid],
        },
      };
    }

    return null;
  };
}

/**
 * Valida la fecha de fin del formulario con respecto a la de inicio.
 * @param form Formulario con los campos de fecha de inicio del evento para comparar con los de la fecha de fin.
 * @param language Lenguaje seleccionado del calendario.
 * @returns Null si la fecha es correcta o un mensaje de error si no.
 */
export function endDateValidation(
  form: FormGroup,
  language: LanguageModel
): ValidatorFn {
  return () => {
    const startDateForm = form.get(FormFieldKeys.StartDate)?.value;
    const startTimeForm = form.get(FormFieldKeys.StartTime)?.value;

    let startDateTime: Date | null = null;

    if (startDateForm && startTimeForm) {
      const [year, month, day] = startDateForm.split('-').map(Number);
      const [hours, minutes] = startTimeForm.split(':').map(Number);

      startDateTime = new Date(year, month - 1, day, hours, minutes);
    }

    if (startDateTime == null) {
      return {
        startDateRequired: {
          message: language.errorMessages[ErrorKeys.StartDateRequired],
        },
      };
    }

    const endDateForm = form.get(FormFieldKeys.EndDate)?.value;
    if (endDateForm == null || endDateForm == '' || endDateForm == undefined) {
      return {
        endDateRequired: {
          message: language.errorMessages[ErrorKeys.EndDateRequired],
        },
      };
    }

    const endTimeForm = form.get(FormFieldKeys.EndTime)?.value;
    if (endTimeForm == null || endTimeForm == '') {
      return {
        endTimeRequired: {
          message: language.errorMessages[ErrorKeys.EndTimeRequired],
        },
      };
    }

    const [year, month, day] = endDateForm.split('-').map(Number);
    const [hours, minutes] = endTimeForm.split(':').map(Number);

    // Crea la fecha sin interpretación de la zona horaria
    const endDateTime = new Date(year, month - 1, day, hours, minutes);

    if (startDateTime > endDateTime) {
      return {
        endDatePrevStartDate: {
          message: language.errorMessages[ErrorKeys.EndDatePrevStartDate],
        },
      };
    }

    return null;
  };
}

/**
 *  Valida si la fecha es válida.
 * @param dateString  Fecha a validar en formato dd/mm/yyyy de tipo string.
 * @returns Un booleano si la fecha es válida o no.
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
