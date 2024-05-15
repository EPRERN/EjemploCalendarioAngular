import { Observable } from 'rxjs';
import { CalendarDay, CalendarEvent, DateType } from '../calendar';
import { CalendarService } from '../calendar/Services';

//======================================================================
//  SIMULACION DE LLAMADOS AL BACKEND API REST
//======================================================================

/**
 * Obtiene los días del mes seleccionado.
 * @param date  Día que contiene el mes que se quiere obtener.
 * @returns  Días del mes en formato CalendarDay[].
 */
export function getDaysForMonthPage(date: Date): CalendarDay[] {
  let output = [
    ...getDaysBeforeMonth(date),
    ...getMonthDays(date),
    ...getDaysAfterMonth(date),
  ];

  return output;
}

/**
 * Agrega un evento a un día.
 * @param event  Evento que se quiere agregar.
 * @returns  True si se agrega el evento, false en caso contrario.
 */

export function addEventToDate(event: CalendarEvent, calendarService: CalendarService): Observable<CalendarEvent> {
  return calendarService.addEvent(event);
}


/**
 * Actualiza un evento.
 * @param eventUpdated  Evento actualizado.
 * @returns  True si se actualiza el evento, false en caso contrario.
 */
export function updateEvent(eventUpdated: CalendarEvent, calendarService: CalendarService): Observable<CalendarEvent> {
  // Suponiendo que 'eventUpdated' tiene un atributo 'id'
  return calendarService.updateEvent(eventUpdated.id, eventUpdated);
}

export function deleteEvent(event: CalendarEvent, calendarService: CalendarService): Observable<any> {
  // Suponiendo que 'event' tiene un atributo 'id'
  return calendarService.deleteEvent(event.id, event);
}

/**
 * Elimina todos los eventos de un día.
 * @param date  Día del que se quieren eliminar los eventos.
 * @returns  True si se eliminan los eventos, false en caso contrario.
 */
export function deleteAllEventsOfTheDay(date: Date, calendarService: CalendarService): void {
  const events = calendarService.getEventsOfTheDay(date);

  console.log('Fecha enviada desde deleteAllEventsOfTheDay:', date);

  events.forEach((eventsArray: CalendarEvent[]) => {
    eventsArray.forEach((event: CalendarEvent) => {
      calendarService.deleteEvent(event.id, event).subscribe(
        () => {
          console.log('Evento eliminado con éxito:', event);
        },
        (error) => {
          console.error('Error al eliminar el evento:', error);
        }
      );
    });
  });
}



/** Lista de eventos que simula DB en el backend. */
const EVENTS_DB: CalendarEvent[] = generateEvents();

/**
 *  Genera eventos aleatorios para el mes anterior, el mes actual y el mes siguiente.
 * @returns  Una lista de eventos de tipo CalendarEvent[].
 */
function generateEvents(): CalendarEvent[] {
  let events: CalendarEvent[] = [];

  //   const date = new Date();
  //   let month = date.getMonth();
  //   let year = date.getFullYear();

  //   //eventos mes pasado
  //   let previousDate = getPreviousMonthAndItsYear(month, year);

  //   events = [
  //     ...events,
  //     ...generateMonthEvents(previousDate.month, previousDate.year),
  //   ];

  //   // Restablece el año y el mes para el mes actual
  //   month = date.getMonth();
  //   year = date.getFullYear();
  //   events = [...events, ...generateMonthEvents(month, year)]; //eventos mes actual

  //   //eventos mes siguiente
  //   let nextDate = getNextMonthAndItsYear(month, year);
  //   events = [...events, ...generateMonthEvents(nextDate.month, nextDate.year)];
  return events;

}

/**Ajusta el año y el mes para el mes pasado */
function getPreviousMonthAndItsYear(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 0) {
    month = 11;
    year -= 1;
  } else {
    month -= 1;
  }

  return { month, year };
}

/**Ajusta el año y el mes para el mes siguiente */
function getNextMonthAndItsYear(
  month: number,
  year: number
): { month: number; year: number } {
  if (month === 11) {
    month = 0;
    year += 1;
  } else {
    month += 1;
  }

  return { month, year };
}

/**
 * Genera eventos aleatorios para un mes.
 * @param month  Mes para el que se quieren generar eventos.
 * @param year  Año para el que se quieren generar eventos.
 * @returns  Una lista de eventos de tipo CalendarEvent[].
 */
function generateMonthEvents(month: number, year: number) {
  const days = getDaysInMonth(month, year);
  let events: CalendarEvent[] = [];

  days.forEach((day) => {
    let random = Math.floor(Math.random() * 30) + 1;

    if (random <= 3) {
      events = [...events, ...generateDayEvents(day)];
    }
  });

  return events;
}

/**
 * Obtiene los días de un mes.
 * @param month  Mes del que se quieren obtener los días.
 * @param year  Año del que se quieren obtener los días.
 * @returns  Una lista de días de tipo Date[].
 */
function getDaysInMonth(month: number, year: number): Date[] {
  const days: Date[] = [];

  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

/**
 * Genera eventos aleatorios para un día.
 * @param date  Día para el que se quieren generar eventos.
 * @returns  Una lista de eventos de tipo CalendarEvent[].
 */
function generateDayEvents(date: Date) {
  let events: CalendarEvent[] = [];

  const dayRandom = Math.floor(Math.random() * 28) + 1;
  const eventsCountRandom = Math.floor(Math.random() * 10) + 1;

  for (let index = 0; index < eventsCountRandom; index++) {
    let event: CalendarEvent = {
      id: generateDayId(),
      title: `Event ${index}`,
      description: `Description ${index}`,
      startDate: new Date(date.getFullYear(), date.getMonth(), dayRandom),
      color: getRandomColor(),
      isAllDay: getRandomBoolean(),
      distritos: '',
      diasHabiles: 0
    };

    if (!event.isAllDay) {
      event.endDate = addThirtyMinutes(event.startDate);
    }

    events.push(event);
  }

  return events;
}

/**
 * Genera un id para un día.
 * @param date  Día para el que se quiere generar un id.
 * @returns  Un id para el día.
 */
function generateDayId(): number {
  const timestamp = Date.now(); // fecha y hora actual en milisegundos
  const randomNum = Math.floor(Math.random() * 1000000); // número aleatorio entre 0 y 999999
  return timestamp + randomNum;
}

/**
 * Genera un color aleatorio.
 * @returns  Un color aleatorio.
 */
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Genera un booleano aleatorio.
 * @returns  Un booleano aleatorio.
 */
function getRandomBoolean() {
  return Math.random() < 0.5;
}

/**
 * Agrega 30 minutos a una fecha.
 * @param date  Fecha a la que se le quiere agregar 30 minutos.
 * @returns  Una fecha con 30 minutos agregados.
 */
function addThirtyMinutes(date: Date): Date {
  let newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() + 30);
  return newDate;
}

//======================================================================
//  OBTENCION DE DIAS DEL MES
//======================================================================

/**
 * @description Obtiene los días antes del mes para completar la grilla de días.
 * @param day Día de la semana del primer día del mes.
 * @returns  Días antes del mes.
 */
function getDaysBeforeMonth(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDay = new Date(year, month, 1); // Año primero, luego mes
  const day = firstDay.getDay();

  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();

  let output: CalendarDay[] = [];

  for (let d = getDayOfWeek(day); d > 0; d--) {
    const dayNumber = prevDays - d + 1;
    output.push(
      createCalendarDay(new Date(year, month - 1, dayNumber), DateType.Before)
    );
  }
  return output;
}

/**
 * Obtiene los días del mes seleccionado.
 * @param date  Día que contiene el mes que se quiere obtener.
 * @returns  Días del mes.
 */
function getMonthDays(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();
  const lastDay = new Date(year, month + 1, 0).getDate();

  let output: CalendarDay[] = [];

  for (let dayNumber = 1; dayNumber <= lastDay; dayNumber++) {
    output.push(
      createCalendarDay(new Date(year, month, dayNumber), DateType.Current)
    );
  }

  return output;
}

/**
 * @description Obtiene los días después del mes para completar la grilla de días.
 * @returns  Días después del mes.
 */
function getDaysAfterMonth(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();

  const lastDay = new Date(year, month + 1, 0);
  const nextDaysCount = 7 - lastDay.getDay();

  let output: CalendarDay[] = [];

  for (let dayNumber = 1; dayNumber <= nextDaysCount; dayNumber++) {
    output.push(
      createCalendarDay(new Date(year, month + 1, dayNumber), DateType.After)
    );
  }

  return output;
}

//======================================================================
// UTILIDADES PARA OBTENER DIAS DEL MES
//======================================================================

/**
 * Obtiene el día de la semana tomando en cuenta que el primer día de la semana es el lunes.
 * @param day  Día de la semana.
 * @returns  Día de la semana.
 */
function getDayOfWeek(day: number): number {
  //se cambia el domingo para que sea el ultimo dia de la semana y el lunes el primero
  const dayOfWeek = day - 1;
  return dayOfWeek === -1 ? 6 : dayOfWeek === 6 ? 0 : dayOfWeek;
}

function createCalendarDay(date: Date, dayType: DateType): CalendarDay {
  const calendarDay: CalendarDay = {
    number: date.getDate(),
    dateType: dayType,
    events: getEventsOfTheDay(date),
    isSelected: false,
    isToday: isToday(date),
    dayOfWeek: date.getDay(),
    date: new Date(date),
  };

  return calendarDay;
}

/**
 * Determina si el día pasado por parámetro es el día de hoy.
 * @param date  Día a comparar.
 */
function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
/**
 * Obtiene los eventos de un día.
 * @param date Día del que se quieren obtener los eventos.
 * @returns  Una lista de eventos de tipo CalendarEvent[].
 */
function getEventsOfTheDay(date: Date): CalendarEvent[] {
  return EVENTS_DB.filter((event) => {
    // Si tenemos fecha de fin, filtramos por rango de fechas
    if (event.endDate) {
      return isDateInRangeOfTheEnvent(date, event);
    }

    // Si no tenemos fecha de fin, filtramos por fecha de inicio
    return isEventOfTheDay(date, event);
  });
}


/**
 *  Determina si el día pasado por parámetro es el día de inicio de un evento.
 * @param date  Día a comparar.
 * @param event  Evento a comparar.
 * @returns  True si el día es el día de inicio del evento, false en caso contrario.
 */
function isEventOfTheDay(date: Date, event: CalendarEvent): boolean {
  return (
    event.startDate.getDate() === date.getDate() &&
    event.startDate.getMonth() === date.getMonth() &&
    event.startDate.getFullYear() === date.getFullYear()
  );
}

/**
 * Determina si el día pasado por parámetro está dentro del rango de fechas de un evento.
 * @param date  Día a comparar.
 * @param event  Evento a comparar.
 * @returns  True si el día está dentro del rango de fechas del evento, false en caso contrario.
 */
function isDateInRangeOfTheEnvent(date: Date, event: CalendarEvent): boolean {
  return (
    event.startDate.getDate() <= date.getDate() &&
    event.endDate!.getDate() >= date.getDate() &&
    event.startDate.getMonth() === date.getMonth() &&
    event.endDate!.getMonth() === date.getMonth() &&
    event.startDate.getFullYear() === date.getFullYear() &&
    event.endDate!.getFullYear() === date.getFullYear()
  );
}

function getHighestId(): number {
  return EVENTS_DB.reduce(
    (mayorId, event) => (event.id > mayorId ? event.id : mayorId),
    0
  );
}
