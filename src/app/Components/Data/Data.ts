import { Observable, concat, forkJoin, map, of, reduce, switchMap } from 'rxjs';
import { CalendarDay, CalendarEvent, DateType } from '../calendar';
import { CalendarService } from '../calendar/Services';

//======================================================================
//  SIMULACION DE LLAMADOS AL BACKEND API REST
//======================================================================




export function getDaysForMonthPage(date: Date, calendarService: CalendarService): Observable<CalendarDay[]> {
  const daysBeforeMonth = getDaysBeforeMonth(date);
  const monthDays = getMonthDays(date);
  const daysAfterMonth = getDaysAfterMonth(date);
  const allDays = [...daysBeforeMonth, ...monthDays, ...daysAfterMonth];

  const eventObservables = allDays.map(day => 
    getEventsOfTheDay(day.selectedDate, calendarService).pipe(
      map(events => ({
        ...day,
        events: events
      }))
    )
  );

  return forkJoin(eventObservables);
}







export function addEventToDate(event: CalendarEvent, calendarService: CalendarService): Observable<CalendarEvent> {
 
  return calendarService.addEvent(event);
}

export function updateEvent(eventUpdated: CalendarEvent, calendarService: CalendarService): Observable<CalendarEvent> {
  return calendarService.updateEvent(eventUpdated.id, eventUpdated);
}


export function deleteEvent(event: CalendarEvent, calendarService: CalendarService): Observable<any> {
  return calendarService.deleteEvent(event.id);
}

export function deleteAllEventsOfTheDay(date: Date, calendarService: CalendarService): void {
  // Obtenemos los eventos del día específico
  calendarService.getEventsOfTheDay(date).pipe(
    switchMap((eventsArray: CalendarEvent[]) => {
      // Creamos un arreglo de observables de las eliminaciones de eventos
      const deleteObservables = eventsArray.map((event: CalendarEvent) => 
        calendarService.deleteEvent(event.id)
      );
      // Retornamos un observable que espera a que todos los observables de eliminación completen
      return forkJoin(deleteObservables);
    })
  ).subscribe(
    () => {
      console.log('Todos los eventos del día han sido eliminados con éxito.');
    },
    (error) => {
      console.error('Error al eliminar los eventos del día:', error);
    }
  );
}




function getDaysBeforeMonth(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1);
  const day = firstDay.getDay();
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();

  let output: CalendarDay[] = [];
  for (let d = getDayOfWeek(day); d > 0; d--) {
    const dayNumber = prevDays - d + 1;
    output.push(createCalendarDay(new Date(year, month - 1, dayNumber), DateType.Before));
  }
  return output;
}



function getMonthDays(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();
  const lastDay = new Date(year, month + 1, 0).getDate();

  let output: CalendarDay[] = [];
  for (let dayNumber = 1; dayNumber <= lastDay; dayNumber++) {
    output.push(createCalendarDay(new Date(year, month, dayNumber), DateType.Current));
  }
  return output;
}


function getDaysAfterMonth(date: Date): CalendarDay[] {
  const month = date.getMonth();
  const year = date.getFullYear();
  const lastDay = new Date(year, month + 1, 0);
  const nextDaysCount = 7 - lastDay.getDay();

  let output: CalendarDay[] = [];
  for (let dayNumber = 1; dayNumber <= nextDaysCount; dayNumber++) {
    output.push(createCalendarDay(new Date(year, month + 1, dayNumber), DateType.After));
  }
  return output;
}



function getDayOfWeek(day: number): number {
  //se cambia el domingo para que sea el ultimo dia de la semana y el lunes el primero
  const dayOfWeek = day - 1;
  return dayOfWeek === -1 ? 6 : dayOfWeek === 6 ? 0 : dayOfWeek;
}


function createCalendarDay(date: Date, dayType: DateType, events: CalendarEvent[] = []): CalendarDay {
  return {
    number: date.getDate(),
    dateType: dayType,
    events: events,
    isSelected: false,
    isToday: isToday(date),
    dayOfWeek: date.getDay(),
    selectedDate: new Date(date),
  };
}




function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}





function getEventsOfTheDay(date: Date, calendarService: CalendarService): Observable<CalendarEvent[]> {
  return calendarService.getEventsOfTheDay(date)
    .pipe(
      map(events => {
        return events.filter(event => {
          const eventStartDate = new Date(event.startDate);
          const eventEndDate = event.endDate ? new Date(event.endDate) : null;

          if (eventEndDate) {
            return isDateInRangeOfTheEvent(date, eventStartDate, eventEndDate);
          }

          return isEventOfTheDay(date, eventStartDate);
        });
      })
    );
}









function isDateInRangeOfTheEvent(date: Date, eventStartDate: Date, eventEndDate: Date): boolean {
  const inRange = (
    eventStartDate <= date &&
    eventEndDate >= date
  );
  console.log(`Date ${date} is in range of event starting ${eventStartDate} and ending ${eventEndDate}: ${inRange}`);
  return inRange;
}


export function getHighestId(calendarService: CalendarService): Observable<number> {
  return calendarService.getHighestId();
}




function isEventOfTheDay(date: Date, eventStartDate: Date): boolean {
  const isSameDay = (
    eventStartDate.getDate() === date.getDate() &&
    eventStartDate.getMonth() === date.getMonth() &&
    eventStartDate.getFullYear() === date.getFullYear()
  );
  console.log(`Date ${date} is the same day as event starting ${eventStartDate}: ${isSameDay}`);
  return isSameDay;
}
