import { NgIf, NgStyle } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, startWith, takeUntil } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventForm,
  FormFieldKeys,
  LanguageModel,
  TimeDateModal,
} from '../../Models';
import {
  
  EventFormTextsKeys,
  LANGUAGES,
  SPANISH,
} from '../../Models/languages.models';
import {
  endDateValidation,
  startDateValidation,
  startTimeValidation,
} from '../../Validators';
import {
  EventFieldType,
  eventFieldValidation,
} from '../../Validators/event-field.validations';
import { TimeModalComponent } from '../time-modal/time-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { CalendarService } from '../../Services';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    MatSelectModule,
    TimeModalComponent,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatRippleModule,
    CommonModule,
    NgIf,
    NgStyle,
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();

  model: CalendarEventForm = this.createDefaultEvent();

  language: LanguageModel = SPANISH;
  formTextsKeys = EventFormTextsKeys;

  modalTitle = '';

  form!: FormGroup;
  isFormValid = false;

  //errores
  titleError: string = '';
  diasHabilesError: string = '';
  startDateError: string = '';
  startTimeError: string = '';
  endDateError: string = '';
  endTimeError: string = '';

  startDate = '';
  endDate = '';

  constructor(
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEventForm,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private calendarService: CalendarService // Añade esta línea
  ) {}
  

  ngOnInit(): void {
    if (this.data) {
      this.model = this.data;
      this.language = LANGUAGES[this.model.language];
    }
    this.setModalTitle();
    this.crearForm();
    this.initErrorsMessages();
  }


  distritos: any[] = [
    'GENERAL CONESA',
    'VIEDMA',
    'SAN ANTONIO OESTE',
    'SIERRA GRANDE',
    'VALCHETA',
    'RIO COLORADO',
    'CHOELE CHOEL',
    'CIPOLLETTI',
    'ALLEN',
    'GENERAL ROCA',
    'VILLA REGINA',
    'CINCO SALTOS',
    'CATRIEL',
    'CERRO POLICIA',
    'EL CUY',
    'BARILOCHE',
    'INGENIERO JACOBACCI',
    'EL CAIN',
    'EL BOLSON'
  ];
  
  onSubmit() {
    const startDate = this.form.get(FormFieldKeys.StartDate)?.value;
    const endDate = this.form.get(FormFieldKeys.EndDate)?.value;
    const diasHabiles = this.calcularDiasHabiles(startDate, endDate);
  
    this.form.get(FormFieldKeys.DiasHabiles)?.setValue(diasHabiles);
  
    const updatedEvent = this.getUpdatedCalendarEvent();
  
    if (this.model.isEdit) {
      this.calendarService.updateEvent(this.model.id, updatedEvent).subscribe(() => {
        this.dialogRef.close(updatedEvent);
      });
    } else {
      this.calendarService.addEvent(updatedEvent).subscribe((newEvent) => {
        this.dialogRef.close(newEvent);
      });
    }
  }
  
  
  
  

  /** Abre el modal para seleccionar el horario del evento. */
  openTimeDialog(isStartTime: boolean = true) {
    const controlName = isStartTime
      ? FormFieldKeys.StartTime
      : FormFieldKeys.EndTime;

    const time: string = this.form.get(controlName)?.value;

    const date = isStartTime
      ? this.model.startDate
      : this.model.endDate
      ? this.model.endDate
      : new Date();

    const timeDateModal: TimeDateModal = {
      date: date,
      time: time,
      language: this.model.language,
    };

    const dialogRef = this.dialog.open(TimeModalComponent, {
      data: timeDateModal,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result === '' || result === undefined) {
          return;
        }

        this.form.get(controlName)?.setValue(result);
      });
  }

  /** Muestra u oculta los campos de fechas del evento según el estado de isAllDay seleccionado por el usuario. */
  showDates() {
    this.model.isAllDay = !this.model.isAllDay;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  /** Devuelve el evento actualizado con los datos del formulario. */
  private getUpdatedCalendarEvent(): CalendarEvent {
    const output: CalendarEvent = {
      id: this.model.id,
      title: this.form.get(FormFieldKeys.Title)?.value,
      diasHabiles: this.form.get(FormFieldKeys.DiasHabiles)?.value,
      startDate: this.createDate(),
      endDate: this.createDate(false),
      color: this.form.get(FormFieldKeys.Color)?.value,
      isAllDay: this.form.get(FormFieldKeys.IsAllDay)?.value,
      distritos: this.form.get(FormFieldKeys.distritos)?.value,
            // diasHabiles:this.model.diasHabiles
    };

    if (output.isAllDay) {
      output.startDate.setHours(0, 0, 0, 0);
      output.endDate = undefined;
    }

    return output;
  }

  /** Crea una fecha y hora a partir de los valores del formulario.*/
  private createDate(isStartDate: boolean = true): Date {
    const date = isStartDate
      ? this.form.get(FormFieldKeys.StartDate)?.value
      : this.form.get(FormFieldKeys.EndDate)?.value;

    const time = isStartDate
      ? this.form.get(FormFieldKeys.StartTime)?.value
      : this.form.get(FormFieldKeys.EndTime)?.value;

    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    // Crea la fecha sin interpretación de la zona horaria
    return new Date(year, month - 1, day, hours, minutes);
  }

  /** Establece el título de la ventana modal con el idioma establecido. */
  private setModalTitle() {
    this.modalTitle = this.model.isEdit
      ? this.language.eventFormTexts[EventFormTextsKeys.HeaderTitleEdit]
      : this.language.eventFormTexts[EventFormTextsKeys.HeaderTitleAdd];
  }

  /** Crea el formulario con los campos del evento. */
  private crearForm() {
    console.log('Datos del evento:', this.model); // Verifica los datos del evento recibidos
    this.form = this.formbuilder.group({
      [FormFieldKeys.Id]: 0,
      [FormFieldKeys.Title]: [
        
      ],
      [FormFieldKeys.DiasHabiles]: ['', [Validators.maxLength(200)]],
      [FormFieldKeys.StartDate]: ['', [startDateValidation(this.language)]],
      [FormFieldKeys.StartTime]: ['', [startTimeValidation(this.language)]],
      [FormFieldKeys.EndDate]: [''],
      [FormFieldKeys.EndTime]: [''],
      [FormFieldKeys.Color]: ['#AD0000'],
      [FormFieldKeys.IsAllDay]: [false],
      [FormFieldKeys.distritos]: [],
      // [FormFieldKeys.diasHabiles]: [0],
      
      
    });

    this.setValidatorsToEndDateAndEndTime();

    if (this.model.id > 0 || this.model.isEdit) {
      this.form.patchValue(this.model);
    }

    this.setStartDateInForm();
    this.setEndDateInForm();
  }

  /** Asigna los validadores a los campos de fecha y hora de fin del evento. */
  private setValidatorsToEndDateAndEndTime() {
    // Después de que se ha creado el formulario, se le asignan los validadores a los campos de fecha y hora de fin ya que necesitan la fecha de inicio tambien, por lo que mandamos el form entero.
    this.form
      .get(FormFieldKeys.EndDate)
      ?.setValidators(endDateValidation(this.form, this.language));
    this.form
      .get(FormFieldKeys.EndTime)
      ?.setValidators(endDateValidation(this.form, this.language));
  }

  /** Establece la fecha de início en el formulario.  */
  private setStartDateInForm() {
    this.form
      .get(FormFieldKeys.StartDate)
      ?.setValue(this.formatDateString(this.model.startDate));
    this.form
      .get(FormFieldKeys.StartTime)
      ?.setValue(this.formatTimeString(this.model.startDate));
  }

  /** Establece la fecha de fin en el formulario.  */
  private setEndDateInForm() {
    let endDate: Date;

    if (this.model.endDate) {
      endDate = new Date(this.model.endDate!);
    } else {
      // Si no hay fecha de fin, se establece la fecha de inicio + 30 minutos.
      endDate = new Date(this.model.startDate);
      let minutes = endDate.getMinutes() + 30;
      endDate.setMinutes(minutes);
    }

    this.form
      .get(FormFieldKeys.EndDate)
      ?.setValue(this.formatDateString(endDate));
    this.form
      .get(FormFieldKeys.EndTime)
      ?.setValue(this.formatTimeString(endDate));
  }

  /** Establece el formato de la fecha como: dd/MM/yyyy. */
  private formatDateString(date: Date): string {
    const [day, month, year] = date
      .toLocaleString()
      .split(/[\/,:\s]/)
      .map((part) => parseInt(part));

    const endFormattedDate = new Date(year, month - 1, day);

    return endFormattedDate.toISOString().split('T')[0];
  }

  /** Establece el formato de la hora como: HH:MM. */
  private formatTimeString(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Inicializa los mensajes de error de los campos del formulario.
   */
  private initErrorsMessages() {
    Object.values(EventFieldType).forEach((field) => {
      this.form
        .get(field)!
        .valueChanges.pipe(startWith(''), takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.fieldValidation(field);
        });
    });
  }

  /**
   * Valida el campo del formulario y establece el mensaje de error correspondiente.
   * @param field Campo del formulario a validar.
   */
  private fieldValidation(field: EventFieldType) {
    const error = eventFieldValidation(this.form, field, this.model.language);

    switch (field) {
      case EventFieldType.Title:
        this.titleError = error;
        break;
      case EventFieldType.DiasHabiles:
        this.diasHabilesError = error;
        break;
      case EventFieldType.StartDate:
        this.startDateError = error;
        this.handleDateUpdate(true, error);
        break;
      case EventFieldType.StartTime:
        this.startTimeError = error;
        this.handleDateUpdate(true, error);
        break;
      case EventFieldType.EndDate:
        this.endDateError = error;
        this.handleDateUpdate(false, error);
        break;
      case EventFieldType.EndTime:
        this.endTimeError = error;
        this.handleDateUpdate(false, error);
        break;
    }
  }

  /**
   * Actualiza la fecha en el modelo si no hay errores en la fecha especificada.
   * @param isStartDate Indica si la fecha es de inicio o fin.
   * @param error Mensaje de error del campo de fecha.
   */
  private handleDateUpdate(isStartDate: boolean, error: string) {
    if (error !== '') return;

    const dateKey = isStartDate
      ? FormFieldKeys.StartDate
      : FormFieldKeys.EndDate;
    const timeKey = isStartDate
      ? FormFieldKeys.StartTime
      : FormFieldKeys.EndTime;

    const date = this.form.get(dateKey)?.value;
    const time = this.form.get(timeKey)?.value;

    if (date && time) {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      // Crea la fecha sin interpretación de la zona horaria
      const dateTime = new Date(year, month - 1, day, hours, minutes);

      isStartDate
        ? (this.model.startDate = dateTime)
        : (this.model.endDate = dateTime);
    }
  }




  calcularDiasHabiles(startDate: Date, endDate: Date): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Si startDate es posterior a endDate, se intercambian las fechas
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    let count = 0;
    let currentDate = start;

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Si no es sábado (6) ni domingo (0)
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  /** Devuelve un evento por defecto. */
  private createDefaultEvent(): CalendarEventForm {
    return {
      id: 0,
      title: '',
      diasHabiles: 0,
      startDate: new Date(),
      endDate: new Date(),
      color: '',
      isAllDay: false,
      isEdit: false,
      language: this.data.language,
      distritos:'',
      // diasHabiles:0
    };
  }
}
