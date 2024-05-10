import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { CalendarDay, CalendarEvent } from '../Models';
import {
  
  deleteAllEventsOfTheDay,
  deleteEvent,
  getDaysForMonthPage,
  updateEvent,
} from '../../Data/Data';
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
    // addEventToDate(event, this);
    return this.http.post<CalendarEvent>(this.baseUrl, event);

  }

  public updateEvent(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    // updateEvent(event, this); // Pasando una instancia de CalendarService como segundo argumento
    return this.http.put<CalendarEvent>(`${this.baseUrl}/${id}`, event);
  }
  

  public deleteEvent(id: number, event: CalendarEvent): Observable<any> {
    // deleteEvent(event, this); // Pasando una instancia de CalendarService como segundo argumento
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  


  public getDaysForMonthPage(date: Date): CalendarDay[] {
    return getDaysForMonthPage(date);
  }

  getEventsOfTheDay(date: Date): Observable<CalendarEvent[]> {
    // Aquí deberías hacer una solicitud HTTP al backend para obtener los eventos del día
    // Por simplicidad, aquí solo devolveré un observable vacío
    return new Observable<CalendarEvent[]>(observer => {
      observer.next([]); // Simplemente devuelvo una lista vacía por ahora
      observer.complete();
    });
  }


  public deleteAllEventsOfTheDay(date: Date): Observable<any> {
    // Formatear la fecha en formato ISO 8601 sin la hora
    const formattedDate = date.toISOString().split('T')[0];
    console.log('Fecha formateada enviada a Spring:', formattedDate);
    
    // Enviar la fecha en el cuerpo de la solicitud DELETE
    return this.http.delete<any>(`${this.baseUrl}/deleteAllEventsOfTheDay`, { body: { date: formattedDate } });
  }
  
  
  


  

}
