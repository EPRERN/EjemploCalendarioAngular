import { Injectable } from '@angular/core';
import {
  addEventToDate,
  deleteAllEventsOfTheDay,
  deleteEvent,
  getDaysForMonthPage,
  updateEvent,
} from '../../Data/Data';
import { CalendarDay, CalendarEvent } from '../Models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {


  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }
  /**
   *  Devuelve los días del mes seleccionado.
   * @param date  Fecha seleccionada.
   * @returns  Devuelve los días del mes seleccionado.
   */
  public getDaysForMonthPage(date: Date): CalendarDay[] {
    return getDaysForMonthPage(date);
  }

  getAllEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}`);
  }
  
  /**
   *  Agrega un evento a la fecha seleccionada.
   * @param event  Evento a agregar.
   * @returns  Un valor booleano que indica si se pudo agregar el evento.
   */
  public addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.baseUrl}`, event);
  }

  /**
   *  Actualiza un evento.
   * @param event  Evento a actualizar.
   * @returns  Un valor booleano que indica si se pudo actualizar el evento.
   */
  public updateEvent(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.baseUrl}/${id}`, event);
  }


  /**
   *  Elimina un evento.
   * @param event  Evento a eliminar.
   * @returns  Un valor booleano que indica si se pudo eliminar el evento.
   */
  public deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   *  Elimina todos los eventos de la fecha seleccionada.
   * @param date  Fecha seleccionada.
   * @returns  Un valor booleano que indica si se pudieron eliminar los eventos.
   */
// Cambia la firma del método deleteAllEventsOfTheDay en el servicio CalendarService
public deleteAllEventsOfTheDay(date: Date): Observable<any> {
  // Formatea la fecha en un formato adecuado para la URL, por ejemplo, ISO string
  const formattedDate = date.toISOString();
  // Utiliza los parámetros de la solicitud para pasar la fecha
  return this.http.delete<any>(`${this.baseUrl}/deleteAllEventsOfTheDay`, { params: { date: formattedDate } });
}

}
