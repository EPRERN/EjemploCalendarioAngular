import { style } from "@angular/animations";

interface TextCalendarDictionary {
  [key: string]: string;
}

export enum Languages {
  SPANISH = 'ESP',
}

export enum ErrorKeys {
  Required = 'required',
  MaxLength = 'maxlength',
  TitleRequired = 'titleRequired',
  TitleMaxLength = 'titleMaxLength',
  DateFormatInvalid = 'dateFormatInvalid',
  StartDateRequired = 'startDateRequired',
  DateInvalid = 'dateInvalid',
  StartTimeRequired = 'startTimeRequired',
  TimeInvalid = 'timeInvalid',
  EndDateRequired = 'endDateRequired',
  EndDateInvalid = 'endDateInvalid',
  EndTimeRequired = 'endTimeRequired',
  EndDatePrevStartDate = 'endDatePrevStartDate',
  AddEventError = 'addEventError',
  UpdateEventError = 'updateEventError',
  DeleteEventError = 'deleteEventError',
  DeleteAllEventsOfTheDayError = 'deleteAllEventsOfTheDayError',
}

export enum PageElementsTextsKeys {
  DatePlaceHolderFormat = 'datePlaceHolderFormat',
  BtnGoToday = 'btnGoToday',
  BtnShowEvents = 'btnShowEvents',
  BtnHideEvents = 'btnHideEvents',
  BtnAddEvent = 'btnAddEvent',
  BtnNext = 'btnNext',
  BtnPrev = 'btnPrev',
  DeleteTitleDialog = 'deleteTitleDialog',
  DeleteMessageDialog = 'deleteMessageDialog',
  DeleteConfirmText = 'deleteConfirmText',
  DeleteCancelText = 'deleteCancelText',
}

export enum EventFormTextsKeys {
  HeaderTitleAdd = 'headerTitleAdd',
  HeaderTitleEdit = 'headerTitleEdit',
  Title = 'title',
  DiasHabiles = 'diasHabiles',
  StartDate = 'startDate',
  StartTime = 'startTime',
  EndDate = 'endDate',
  EndTime = 'endTime',
  Color = 'color',
  IsAllDay = 'isAllDay',
  BtnSaveText = 'btnSaveText',
  BtnCancelText = 'btnCancelText',
  BtnEditText = 'btnEditText',
  TimeModalTitle = 'timeModalTitle',
  MinutesText = 'minutesText',
  HourText = 'hourText',
  distritos = 'distritos',
  selectedDate = 'selectedDate'

}

export interface LanguageModel {
  fullMonthsNames: string[];
  shortMonthsNames: string[];
  fullDayNames: string[];
  shortDayNames: string[];
  pageElementsTexts: TextCalendarDictionary;
  errorMessages: TextCalendarDictionary;
  eventFormTexts: TextCalendarDictionary;
}


export const SPANISH: LanguageModel = {
  fullMonthsNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Deciembre',
  ],
  shortMonthsNames: [
    'Ene.',
    'Feb.',
    'Mar.',
    'Abr.',
    'May.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  fullDayNames: [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ],
  shortDayNames: ['Lun', 'Mar', 'Mié', 'Jue', 'Vir', 'Sáb', 'Dom'],
  pageElementsTexts: {
    datePlaceHolderFormat: 'dd/mm/aaaa',
    btnGoToday: 'Hoy',
    btnShowEvents: 'Mostrar Instalaciones y Retiros',
    btnHideEvents: 'Ocultar Instalaciones y Retiros',
    btnAddEvent: 'Instalaciones y Retiros',
    btnNext: 'Siguiente',
    btnPrev: 'Anterior',
    deleteTitleDialog: 'Eliminar evento',
    deleteMessageDialog: '¿Está seguro que desea eliminar este evento?',
    deleteConfirmText: 'Eliminar',
    deleteCancelText: 'Cancelar',
  },
  errorMessages: {
    titleRequired: 'El título es obligatorio',
    titleMaxLength: 'El título debe tener menos de 60 caracteres',
    descriptionMaxLength: 'La descripción debe tener menos de 200 caracteres',
    dateFormatInvalid: 'El formato de fecha no es válido.',
    dateInvalid: 'La fecha no es válida',
    startDateRequired: 'La fecha de inicio es obligatoria',
    startTimeRequired: 'La hora de inicio es obligatoria',
    timeInvalid: 'La hora no es válida',
    endDateRequired: 'La fecha de fin es obligatoria',
    endDateInvalid: 'La fecha de fin debe ser igual o mayor a la de inicio',
    endTimeRequired: 'La hora de fin es obligatoria',
    endDatePrevStartDate:
      'La fecha de fin debe ser igual o mayor a la de inicio',
    addEventError: 'Error al agregar el evento',
    updateEventError: 'Error al actualizar el evento',
    deleteEventError: 'Error al eliminar el evento',
    deleteAllEventsOfTheDayError: 'Error al eliminar todos los eventos del día',
  },
  eventFormTexts: {
    headerTitleAdd: 'Instalaciones y Retiros',
    headerTitleEdit: 'Editar evento',
    title: 'Título',
    diasHabiles: 'Dias Habiles',
    distritos: 'distritos',
    startDate: 'Fecha de instalación',
    startTime: 'Hora de instalación',
    endDate: 'Fecha de retiro',
    endTime: 'Hora de retiro',
    color: 'Color de etiqueta',
    isAllDay: 'Todo el día',
    btnSaveText: 'Guardar',
    btnCancelText: 'Cancelar',
    btnEditText: 'Editar',
    timeModalTitle: 'Seleccionar hora',
    minutesText: 'Minutos',
    hourText: 'Hora',
  },
};


/**
 * Diccionario de idiomas.
 */
export const LANGUAGES: { [key in Languages]: LanguageModel } = {
  // [Languages.ENGLISH]: ENGLISH,
  [Languages.SPANISH]: SPANISH,
  // [Languages.PORTUGUESE]: PORTUGUESE,
};
