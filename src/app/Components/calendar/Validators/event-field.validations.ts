import { FormGroup } from '@angular/forms';
import { ErrorKeys, LANGUAGES, LanguageModel, Languages } from '../Models';

export enum EventFieldType {
  Title = 'title',
  DiasHabiles = 'diasHabiles',
  StartDate = 'startDate',
  StartTime = 'startTime',
  EndDate = 'endDate',
  EndTime = 'endTime',
  distritos = 'distritos'
  // DiasHabiles = "DiasHabiles",
}

/**
 * Selecciona el validador para los campos del formulario de creación y edición de eventos.
 * @param form Formulario con los datos para validar.
 * @param field Nombre del campo que se desea validar (tipo: EventFieldType).
 * @param language Lenguaje seleccionado del calendario.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
export function eventFieldValidation(
  form: FormGroup,
  field: EventFieldType,
  language: Languages
): string {
  const languageSelected = LANGUAGES[language];

  switch (field) {
    case EventFieldType.Title:
      return titleValidation(form, languageSelected);
    case EventFieldType.DiasHabiles:
      return descriptionValidation(form, languageSelected);
    case EventFieldType.StartDate:
      return startDateValidation(form);
    case EventFieldType.StartTime:
      return startTimeValidation(form);
    case EventFieldType.EndDate:
      return endDateValidation(form);
    case EventFieldType.EndTime:
      return endTimeValidation(form);
    default:
      return '';
  }
}

/**
 * Valida el campo de titulo.
 * @param form Formulario con los datos para validar.
 * @param language Lenguaje seleccionado del calendario.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function titleValidation(form: FormGroup, language: LanguageModel): string {
  var field = form.get('title')!;

  if (field.hasError(ErrorKeys.Required)) {
    return language.errorMessages[ErrorKeys.TitleRequired];
  }

  if (field.hasError(ErrorKeys.MaxLength)) {
    return language.errorMessages[ErrorKeys.TitleMaxLength];
  }

  return '';
}

/**
 * Valída el campo de descripción.
 * @param form Formulario con los datos para validar.
 * @param language Lenguaje seleccionado del calendario.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function descriptionValidation(
  form: FormGroup,
  language: LanguageModel
): string {
  var field = form.get('title')!;

  // if (field.hasError(ErrorKeys.MaxLength)) {
  //   return language.errorMessages[ErrorKeys.DescriptionMaxLength];
  // }

  return '';
}

/**
 * Valída el campo de fecha de inicio.
 * @param form Formulario con los datos para validar.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function startDateValidation(form: FormGroup): string {
  var field = form.get('startDate')!;

  if (field.hasError(ErrorKeys.StartDateRequired)) {
    return field.getError(ErrorKeys.StartDateRequired).message;
  }

  if (field.hasError(ErrorKeys.DateInvalid)) {
    return field.getError(ErrorKeys.DateInvalid).message;
  }

  return '';
}

/**
 * Valída el campo de hora de inicio.
 * @param form Formulario con los datos para validar.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function startTimeValidation(form: FormGroup): string {
  var field = form.get('startTime')!;

  if (field.hasError(ErrorKeys.StartTimeRequired)) {
    return field.getError(ErrorKeys.StartTimeRequired).message;
  }

  if (field.hasError(ErrorKeys.TimeInvalid)) {
    return field.getError(ErrorKeys.TimeInvalid).message;
  }

  return '';
}

/**
 * Valída el campo de fecha de fin.
 * @param form Formulario con los datos para validar.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function endDateValidation(form: FormGroup): string {
  var field = form.get('endDate')!;

  if (field.hasError(ErrorKeys.StartDateRequired)) {
    return field.getError(ErrorKeys.StartDateRequired).message;
  }

  if (field.hasError(ErrorKeys.Required)) {
    return field.getError(ErrorKeys.Required).message;
  }

  if (field.hasError(ErrorKeys.EndDateRequired)) {
    return field.getError(ErrorKeys.EndDateRequired).message;
  }

  if (field.hasError(ErrorKeys.EndDatePrevStartDate)) {
    return field.getError(ErrorKeys.EndDatePrevStartDate).message;
  }

  if (field.hasError(ErrorKeys.EndDateInvalid)) {
    return field.getError(ErrorKeys.EndDateInvalid).message;
  }

  return '';
}

/**
 * Valída el campo de hora de inicio.
 * @param form Formulario con los datos para validar.
 * @returns Un mensaje con el resultado de la validación (vacio si es correcto: '').
 */
function endTimeValidation(form: FormGroup): string {
  var field = form.get('endTime')!;

  if (field.hasError(ErrorKeys.EndTimeRequired)) {
    return field.getError(ErrorKeys.EndTimeRequired).message;
  }

  if (field.hasError(ErrorKeys.TimeInvalid)) {
    return field.getError(ErrorKeys.TimeInvalid).message;
  }

  if (field.hasError(ErrorKeys.EndDatePrevStartDate)) {
    return field.getError(ErrorKeys.EndDatePrevStartDate).message;
  }

  return '';
}
