import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { CalendarDay, CalendarEvent } from '../Models';
import { getDaysForMonthPage } from '../../Data/Data';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {

  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<CalendarEvent[]> {
    console.log('Realizando solicitud GET a:', `${this.baseUrl}`);
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}`).pipe(
      catchError(error => {
        console.error('Error en la solicitud GET:', error);
        throw error;
      })
    );
  }


  
  public addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.baseUrl}`, event);
  }

  public updateEvent(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.baseUrl}/${id}`, event);
  }

  public deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }


  public getDaysForMonthPage(date: Date): CalendarDay[] {
    return getDaysForMonthPage(date);
  }

  // Modifica el método deleteAllEventsOfTheDay para enviar la fecha en el cuerpo de la solicitud
  public deleteAllEventsOfTheDay(date: Date): Observable<any> {
    // Crea un objeto HttpParams para enviar la fecha en el cuerpo de la solicitud
    const params = new HttpParams().set('date', date.toISOString());
    // Utiliza los parámetros de la solicitud para enviar la fecha
    return this.http.delete<any>(`${this.baseUrl}/deleteAllEventsOfTheDay`, { params });
  }
}
