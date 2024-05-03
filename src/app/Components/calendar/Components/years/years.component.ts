import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarYear, DateType } from '../../Models';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [MatButtonModule, NgClass, NgFor],
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss'],
})
export class YearsComponent implements OnInit {
  /** Año seleccionado.*/
  @Input() year = 1900;
  yearType = DateType;
  yearsRange: CalendarYear[] = [];

  /** Devuelve el año seleccionado. */
  @Output() yearSelected: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.setYearsRange();
    this.setSelectedYear(this.year);
  }

  /** Selecciona el año en el calendario.
   * @param year  Año seleccionado.
   */
  selectYear(year: CalendarYear) {
    this.yearsRange.forEach((y) => (y.isSelected = false));
    year.isSelected = true;

    this.yearSelected.emit(year.number);
  }

  /** Establece el año seleccionado.
   * @param year  Año seleccionado.
   */
  private setSelectedYear(year: number) {
    this.yearsRange.forEach((y) => (y.isSelected = false));

    const yearSelected = this.yearsRange.find((y) => y.number === year);
    if (yearSelected != undefined) yearSelected.isSelected = true;
  }

  /** Establece el rango de años a mostrar en el panel del calendario.*/
  private setYearsRange() {
    const decade = this.getDecade(this.year);

    this.yearsRange.push(this.getYearBeforeDecade(decade));

    this.yearsRange = [
      ...this.yearsRange,
      ...this.getYearsOfCurrentDecade(decade),
    ];

    this.yearsRange.push(this.getYearAfterDecade(decade));
  }

  /** Obtiene el año anterior de la decada seleccionado.
   * @param decade  Decada del año seleccionado.
   * @returns  Año anterior a la decada seleccionada.
   */
  private getYearBeforeDecade(decade: number): CalendarYear {
    const year = decade - 1;

    const yearBeforeDecade: CalendarYear = {
      number: year,
      isSelected: false,
      isCurrentYear: this.isCurrentYear(year),
      yearType: DateType.Before,
    };

    return yearBeforeDecade;
  }

  /** Obtiene los años de la decada actual.
   * @param decade  Decada del año seleccionado.
   * @returns  Años de la decada actual.
   */
  private getYearsOfCurrentDecade(decade: number): CalendarYear[] {
    let output: CalendarYear[] = [];

    for (let i = 0; i < 10; i++) {
      const year: CalendarYear = {
        number: decade + i,
        isSelected: false,
        isCurrentYear: this.isCurrentYear(decade + i),
        yearType: DateType.Current,
      };

      output.push(year);
    }
    return output;
  }

  /** Obtiene el año siguiente de la decada seleccionado.
   * @param decade  Decada del año seleccionado.
   * @returns  Año siguiente a la decada seleccionada.
   */
  private getYearAfterDecade(decade: number): CalendarYear {
    const year = decade + 10;

    const yearAfterDecade: CalendarYear = {
      number: year,
      isSelected: false,
      isCurrentYear: this.isCurrentYear(year),
      yearType: DateType.After,
    };

    return yearAfterDecade;
  }

  /** Verifica si el año es el año actual.
   * @param year  Año a verificar.
   * @returns  Verdadero si el año es el año actual.
   */
  private isCurrentYear(year: number): boolean {
    return year === new Date().getFullYear();
  }

  /** Obtiene la decada del año seleccionado.
   * @param year  Año seleccionado.
   * @returns  Decada del año seleccionado.
   */
  private getDecade(year: number): number {
    return Math.floor(year / 10) * 10;
  }
}
