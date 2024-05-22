import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
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
  


  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}`);
  }

  getEventsForMonth(month: number, year: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}?month=${month + 1}&year=${year}`);
  }

  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.baseUrl, event);
  }

  updateEvent(id: number, event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.baseUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }


  public getDaysForMonthPage(date: Date): Observable<CalendarDay[]> {
    return getDaysForMonthPage(date, this);
  }



  
  getEventsOfTheDay(date: Date): Observable<CalendarEvent[]> {
    const isoDateString = date.toISOString().split('T')[0]; // Convertir la fecha a una cadena ISO
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}/eventsOfTheDay?date=${isoDateString}`);
  }
  

  deleteAllEventsOfTheDay(date: Date): Observable<any> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.delete<any>(`${this.baseUrl}/deleteAllEventsOfTheDay`, { body: { date: formattedDate } });
  }

  getHighestId(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/highestId`);
  }
  

}
