import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CalendarDay, CalendarEvent, DateType,  SPANISH } from '../../Models';
import { CalendarService } from '../../Services';

@Component({
  selector: 'app-days',
  standalone: true,
  imports: [MatButtonModule, MatRippleModule, NgFor, NgClass, NgStyle],
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.scss'],
})
export class DaysComponent implements OnInit {

  
  dayType = DateType;

  /** Fecha seleccionada. */
  @Input() date!: Date;

  /** Nombre de los días de la semana en formato corto. */
  @Input() dayNames = SPANISH.shortDayNames;

  /** Devuelve el día seleccionado en formato CalendarDay. */
  @Output() selectedDay = new EventEmitter<CalendarDay>();

  month = 0;
  year = 1900;
  daysMonth: CalendarDay[] = [];

  events: CalendarEvent[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadDays();
  }


  /** Carga los días del mes seleccionado, los eventos y establece el día seleccionado por defecto. */
 
  loadDays() {
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
  
    this.calendarService.getDaysForMonthPage(this.date).subscribe(days => {
      this.daysMonth = days;
      this.setDefaultSelectDay();
    }, error => {
      console.error('Error al obtener los días del mes:', error);
    });
  
    // No necesitas manejar los eventos aquí, ya que se incluyen en la respuesta de getDaysForMonthPage
  }
  

  

  /** Establece el día seleccionado por defecto. */
  setDefaultSelectDay() {
    const day = this.daysMonth.find((d) => d.number === this.date.getDate());
    if (!day) return;
    this.selectDay(day);
  }

  /** Selecciona un día en el calendario.
   * @param day  Día seleccionado.
   */
  selectDay(day: CalendarDay) {
    this.daysMonth.forEach((d) => (d.isSelected = false));
    day.isSelected = true;
    day.selectedDate = new Date(this.year, this.month, day.number);

    this.selectedDay.emit(day);
  }
}
