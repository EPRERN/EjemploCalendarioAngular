import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarMonth,  SPANISH } from '../../Models';

@Component({
  selector: 'app-months',
  standalone: true,
  imports: [MatButtonModule, NgClass, NgFor],
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss'],
})
export class MonthsComponent implements OnInit {
  /** Fecha seleccionada. */
  @Input() date = new Date();

  /** Nombres de los meses en formato corto.*/
  @Input() monthsNames = SPANISH.shortMonthsNames;

  /** Devuelve el mes seleccionado. */
  @Output() monthSelected: EventEmitter<number> = new EventEmitter<number>();

  months: CalendarMonth[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setMonthsInCalendar();
  }

  /** Establece el mes seleccionado. */
  setSelectMonth(month: CalendarMonth) {
    this.months.forEach((m) => (m.isSelected = false));
    month.isSelected = true;

    this.monthSelected.emit(month.number);
  }

  /** Establece los meses en el calendario. */
  private setMonthsInCalendar() {
    this.monthsNames.forEach((monthName, index) => {
      this.months.push({
        name: monthName,
        number: index,
        isSelected: false,
        isCurrentMonth: this.isCurrentMonth(index),
      });
    });

    this.setSelectedMonth();
  }

  /** Establece el mes seleccionado. */
  private setSelectedMonth() {
    this.months.forEach((m) => (m.isSelected = false));

    const monthSelected = this.months.find(
      (m) => m.number === this.date.getMonth()
    );
    if (monthSelected != undefined) monthSelected.isSelected = true;
  }

  /** Comprueba si el mes es el actual. */
  private isCurrentMonth(month: number): boolean {
    return (
      new Date().getMonth() == month &&
      new Date().getFullYear() == this.date.getFullYear()
    );
  }
}
