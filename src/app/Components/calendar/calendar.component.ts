import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DaysComponent, MonthsComponent, YearsComponent } from './Components';
import { EventTagComponent } from './Components/event-tag/event-tag.component';

import { Subject, takeUntil } from 'rxjs';
import { ConfirmDeleteModalComponent } from './Components/confirm-delete-modal/confirm-delete-modal.component';
import { EventFormComponent } from './Components/event-form/event-form.component';
import {
  CalendarDay,
  CalendarEvent,
  CalendarPanel,
  ENGLISH,
  ErrorKeys,
  LANGUAGES,
  LanguageModel,
  Languages,
  PageElementsTextsKeys,
  getDefaultCalendarEvent,
} from './Models';
import { CalendarService } from './Services';
import { dateValidation } from './Validators';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DaysComponent,
    MonthsComponent,
    YearsComponent,
    EventTagComponent,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatDialogModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();
  events: CalendarEvent[] = []; // Variable para almacenar los eventos

  languages = Object.values(Languages);
  elementsKeys = PageElementsTextsKeys;
  calendarMonthYear: string = '';

  /** Si es true el panel de eventos se oculta.*/
  @Input() isEventsPanelHidden = false;

  /** El idioma del calendario.*/
  @Input() language = Languages.ENGLISH;
  languageModel: LanguageModel = ENGLISH;
  langSelected = Languages.ENGLISH;

  panelsType = CalendarPanel;
  panelSelected: CalendarPanel = CalendarPanel.Days;

  selectedDate = new Date();
  fullDayName = '';
  year = this.selectedDate.getFullYear();
  month = this.selectedDate.getMonth();

  dateForm = new FormControl('', [dateValidation(this.languageModel)]);
  errorDate = '';
  isBtnGoToDateDisabled = true;
  selectedValue: string = '';
  btnEventsText = this.isEventsPanelHidden ? 'Show events' : 'Hide events';

  eventsOfTheDay: CalendarEvent[] = [];
  reloadChildComponent = false;

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showHideEvents();
    this.setLanguage();
    this.loadEvents(); // Cargar los eventos al iniciar el componente
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  openAddEventDialog() {
    let newEvent = getDefaultCalendarEvent();
    newEvent.language = this.langSelected;
    newEvent.startDate = this.selectedDate;
  
    const dialogRef = this.dialog.open(EventFormComponent, {
      data: newEvent,
    });
  
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result === '' || result === undefined) {
          return;
        }
  
        //==================================================================================================
        // AQUI IRIA EL CODIGO PARA GUARDAR EL EVENTO EN EL BACKEND Y LUEGO AGREGARLO A LA LISTA DE EVENTOS
        //==================================================================================================
  
        this.calendarService.addEvent(result)
          .subscribe((response) => {
            if (!response) {
              console.error(
                this.languageModel.errorMessages[ErrorKeys.AddEventError]
              );
            } else {
              this.reloadComponent();
            }
          });
  
        //==================================================================================================
      });
  }


  loadEvents() {
    this.calendarService.getAllEvents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (events: CalendarEvent[]) => {
          this.events = events;
        },
        (error) => {
          console.error('Error al cargar los eventos:', error);
        }
      );
  }
  
  deleteAllDialog() {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      data: this.languageModel,
    });
  
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result === true) {
          //==================================================================================================
          // AQUI IRIA EL CODIGO PARA ELIMINAR TODOS LOS EVENTOS DEL DIA EN EL BACKEND
          //==================================================================================================
  
          this.calendarService.deleteAllEventsOfTheDay(this.selectedDate)
            .subscribe((response) => {
              if (response === false) {
                console.error(
                  this.languageModel.errorMessages[
                    ErrorKeys.DeleteAllEventsOfTheDayError
                  ]
                );
              } else {
                this.reloadComponent();
              }
            });
  
          //==================================================================================================
        }
      });
  }
  

  /** Establece el idioma del calendario. */
  setLanguage() {
    this.languageModel = LANGUAGES[this.langSelected];
    this.setTitlePanel();
    this.showOrHideBtnAddEvent();
    this.updateTextButtonAndIcon();
    this.updateGoToDateFormLanguage();
    this.reloadComponent();
  }

  /**  selecciona el panel del calendario (dias, meses o años).*/
  selectPanel() {
    this.panelSelected =
      this.panelSelected === CalendarPanel.Days
        ? CalendarPanel.Months
        : this.panelSelected === CalendarPanel.Months
        ? CalendarPanel.Years
        : CalendarPanel.Days;

    this.setTitlePanel();
  }

  /**  Establece el nombre del dia seleccionado en el calendario en la sección de eventos.*/
  setSelectedDate(selected: CalendarDay) {
    setTimeout(() => {
      this.selectedDate = selected.date;
      this.fullDayName =
        this.languageModel.fullDayNames[
          this.getDayOfWeek(selected.date.getDay())
        ];
      this.eventsOfTheDay = selected.events;
    });
  }

  /** Establece el año seleccionado en el calendario.
   * @param year  El año seleccionado.
   */
  yearHandler(year: number) {
    this.year = year;
    this.selectedDate = new Date(this.year, this.month, 1);
    this.panelSelected = CalendarPanel.Months;
    this.calendarMonthYear = this.year.toString();
  }

  /** Establece el mes seleccionado en el calendario.
   * @param month El mes seleccionado.
   */
  monthHandler(month: number) {
    this.month = month;
    this.selectedDate = new Date(this.year, this.month, 1);
    this.panelSelected = CalendarPanel.Days;
    this.updateCalendarTitle();
  }

  /** Establece el día seleccionado en el calendario con la fecha de hoy. */
  goToday() {
    this.panelSelected = CalendarPanel.Days;
    this.reloadComponent(new Date());
  }

  /** Establece el mes o la decada anterior según el panel seleccionado.*/
  prevDatePanel() {
    if (this.panelSelected === CalendarPanel.Years) {
      this.year = this.getDecade(this.year) - 10;
      this.reloadComponent(new Date(this.year, this.month, 1));
    } else {
      this.prevDaysMonth();
    }
  }

  /** Establece el mes o la decada si según el panel seleccionado.*/
  nextDatePanel() {
    if (this.panelSelected === CalendarPanel.Years) {
      this.year = this.getDecade(this.year) + 10;
      this.reloadComponent(new Date(this.year, this.month, 1));
    } else {
      this.nextDaysMonth();
    }
  }

  /** Recarga el componente del calendario.
   * @param date La fecha seleccionada.
   */
  reloadComponent(date: Date = this.selectedDate) {
    this.reloadChildComponent = true;
    this.selectedDate = date;
    this.month = this.selectedDate.getMonth();
    this.year = this.selectedDate.getFullYear();
    this.setTitlePanel();

    setTimeout(() => {
      this.reloadChildComponent = false;
    });
  }

  /** Manejador del evento keyup del input de la fecha a la que ir.
   * @param event Evento keyup a manejar.
   */
  onInputChange(event: KeyboardEvent) {
    this.dateForm.setValue(this.formatDate(event));
  }

  /** Va a la fecha ingresada. */
  goToDate() {
    if (
      this.dateForm.value &&
      this.dateForm.value!.length === 10 &&
      !this.dateForm.hasError(ErrorKeys.DateInvalid)
    ) {
      const [day, month, year] = this.dateForm.value!.split('/').map(Number);

      this.year = year;
      this.month = month - 1;
      this.selectedDate = new Date(year, month - 1, day);

      this.panelSelected = CalendarPanel.Days;
      this.reloadComponent();
    }
  }

  /** Muestra u oculta el panel de eventos. */
  showHideEvents() {
    this.isEventsPanelHidden = !this.isEventsPanelHidden;

    const eventsPanel = document.getElementById('events') as HTMLDivElement;

    if (
      eventsPanel!.style.display === 'none' ||
      (eventsPanel!.style.display === '' && this.isEventsPanelHidden)
    ) {
      eventsPanel!.classList.add('slideRightIn');
      eventsPanel!.style.display = 'flex';
    } else {
      this.removeAnimation(eventsPanel);
    }

    this.showOrHideBtnAddEvent();
    this.updateTextButtonAndIcon();
  }

  /** Actualiza el idioma de los mensajes de error del input de la fecha a la que ir.*/
  private updateGoToDateFormLanguage() {
    this.dateForm = new FormControl('', [dateValidation(this.languageModel)]);
  }

  /** Establece el titulo del panel del calendario.*/
  private setTitlePanel() {
    this.panelSelected === CalendarPanel.Days
      ? this.updateCalendarTitle()
      : this.panelSelected === CalendarPanel.Months
      ? (this.calendarMonthYear = this.selectedDate.getFullYear().toString())
      : this.setDecadeTitle();
  }

  /** Obtiene el número de día de la semana.
   * @param day El número del día.
   * @returns El número del día de la semana.
   */
  private getDayOfWeek(day: number) {
    //se cambia el domingo para que sea el ultimo dia de la semana y el lunes el primero
    const dayOfWeek = day - 1;
    return dayOfWeek === -1 ? 6 : dayOfWeek === 6 ? 0 : dayOfWeek;
  }

  /** Actualiza el titulo del calendario.*/
  private updateCalendarTitle() {
    this.calendarMonthYear = `${
      this.languageModel.fullMonthsNames[this.month]
    } ${this.year}`;
  }

  /** Establece la década seleccionada en el titulo del calendario.*/
  private setDecadeTitle() {
    const selectedYear = this.getDecade(this.year);
    this.calendarMonthYear = `${selectedYear} - ${selectedYear + 9}`;
  }

  /** Obtiene la década de un año.
   * @param year  El año seleccionado.
   * @returns La década del año seleccionado.
   */
  private getDecade(year: number): number {
    return Math.floor(year / 10) * 10;
  }

  /** Muestra los días del mes anterior.*/
  private prevDaysMonth() {
    this.reloadComponent(new Date(this.year, this.month - 1, 1));
  }

  /** Muestra los días del mes siguiente.*/
  private nextDaysMonth() {
    this.reloadComponent(new Date(this.year, this.month + 1, 1));
  }

  //=======================================
  //GO TO DATE FORM SECTION METHODS
  //=======================================

  /** Formatea la fecha ingresada a la que ir.
   * @param event Evento keyup a manejar.
   * @returns La fecha formateada a la que se quiere ir.
   */
  private formatDate(event: KeyboardEvent): string {
    let value = this.dateForm.value?.replace(/[^0-9/]/g, '') || '';
    this.dateForm.markAllAsTouched();

    if (event.key === '/') {
      value = this.handleSlashKeyPress(value);
    } else if (event.key === 'Backspace') {
      value = this.handleBackspaceKeyPress(value);
    } else {
      value = this.handleNumberKeyPress(value);
    }

    this.handleDateValidation();

    return value;
  }

  /** Manejador que verifica si se presionó la tecla slash (/) y la elimina.
   * @param value  Valor de la fecha a la que ir.
   * @returns  El valor de la fecha a la que ir sin la última barra.
   */
  private handleSlashKeyPress(value: string) {
    this.isBtnGoToDateDisabled = true;
    return value.slice(0, value.length - 1);
  }

  /** Manejador que verifica si se presionó la tecla backspace, si es así y el caracter anterior es una barra (/) la elimina.
   * @param value  Valor de la fecha a la que ir.
   * @returns  El valor de la fecha a la que ir formateada.
   */
  private handleBackspaceKeyPress(value: string) {
    const prevLastCharacter = value.slice(value.length - 1);
    if (prevLastCharacter === '/') {
      return value.slice(0, value.length - 1);
    }

    return value;
  }

  /** Manejador que verifica si se presionó un número y lo formatea.
   * @param value  Valor de la fecha a la que ir.
   * @returns  El valor de la fecha a la que ir formateada (dd/mm/yyyy).
   */
  private handleNumberKeyPress(value: string) {
    //si el valor es 3 o 6 caracteres de largo y no termina con barra (/) se agrega la barra
    if ((value.length === 3 || value.length === 6) && !value.endsWith('/')) {
      const lastCharacter = value.slice(value.length - 1);
      value = value.slice(0, value.length - 1) + '/' + lastCharacter;
    }

    //si el valor es 2 o 5 caracteres de largo se agrega la barra
    if (value.length === 2 || value.length === 5) {
      value += '/';
    }

    //si el valor es mayor a 9 caracteres se corta
    if (value.length > 9) {
      value = value.slice(0, 10);
      this.dateForm.setValue(value);
    }

    return value;
  }

  /** Manejador que verifica si la fecha ingresada es válida.*/
  private handleDateValidation(): void {
    const hasDateValidationError = this.dateForm.hasError(
      ErrorKeys.DateFormatInvalid
    );
    this.errorDate = hasDateValidationError
      ? this.dateForm.getError(ErrorKeys.DateFormatInvalid).message
      : '';
    this.isBtnGoToDateDisabled =
      hasDateValidationError || this.dateForm.value?.length !== 10;
  }

  //=======================================
  //EVENTS SECTION METHODS
  //=======================================

  /** Muestra u oculta el botón de agregar evento en el panel del calendario. */
  private showOrHideBtnAddEvent() {
    const btnAddEvent = document.getElementById(
      'btnAddEvent'
    ) as HTMLButtonElement;

    if (btnAddEvent != null) {
      btnAddEvent.style.display = this.isEventsPanelHidden ? 'none' : 'flex';
    }
  }

  /**  Actualiza el texto del botón de mostrar/ocultar eventos y el icono. */
  private updateTextButtonAndIcon(): void {
    const buttonClass = this.isEventsPanelHidden
      ? 'btnHideEvents'
      : 'btnShowEvents';
    this.btnEventsText = this.languageModel.pageElementsTexts[buttonClass];

    const iconEvent = document.getElementById('iconEvent') as HTMLAnchorElement;
    this.isEventsPanelHidden
      ? iconEvent.classList.add('rotate-icon')
      : iconEvent.classList.remove('rotate-icon');
  }

  /**  Elimina la animación de entrada del panel de eventos y lo oculta.
   * @param divEvents  DIV del panel de eventos.
   */
  private removeAnimation(divEvents: HTMLDivElement) {
    divEvents.classList.remove('slideRightIn');
    divEvents.classList.add('slideLeftOut');

    setTimeout(function () {
      divEvents.classList.remove('slideLeftOut');
      divEvents.style.display = 'none';
    }, 250);
  }
}
