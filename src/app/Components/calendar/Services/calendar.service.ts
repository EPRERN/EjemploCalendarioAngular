import { Injectable } from '@angular/core';
import {
  addEventToDate,
  deleteAllEventsOfTheDay,
  deleteEvent,
  getDaysForMonthPage,
  updateEvent,
} from '../../Data/Data';
import { CalendarDay, CalendarEvent } from '../Models';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  /**
   *  Devuelve los días del mes seleccionado.
   * @param date  Fecha seleccionada.
   * @returns  Devuelve los días del mes seleccionado.
   */
  public getDaysForMonthPage(date: Date): CalendarDay[] {
    return getDaysForMonthPage(date);
  }

  /**
   *  Agrega un evento a la fecha seleccionada.
   * @param event  Evento a agregar.
   * @returns  Un valor booleano que indica si se pudo agregar el evento.
   */
  public addEvent(event: CalendarEvent): boolean {
    return addEventToDate(event);
  }

  /**
   *  Actualiza un evento.
   * @param event  Evento a actualizar.
   * @returns  Un valor booleano que indica si se pudo actualizar el evento.
   */
  public updateEvent(event: CalendarEvent): boolean {
    return updateEvent(event);
  }

  /**
   *  Elimina un evento.
   * @param event  Evento a eliminar.
   * @returns  Un valor booleano que indica si se pudo eliminar el evento.
   */
  public deleteEvent(event: CalendarEvent): boolean {
    return deleteEvent(event);
  }

  /**
   *  Elimina todos los eventos de la fecha seleccionada.
   * @param date  Fecha seleccionada.
   * @returns  Un valor booleano que indica si se pudieron eliminar los eventos.
   */
  public deleteAllEventsOfTheDay(date: Date): boolean {
    return deleteAllEventsOfTheDay(date);
  }
}
