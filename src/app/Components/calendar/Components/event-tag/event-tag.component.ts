import { CommonModule, DatePipe, NgIf, NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarEvent,
  CalendarEventForm,
  
  ErrorKeys,
  LANGUAGES,
  LanguageModel,
  Languages,
  SPANISH,
} from '../../Models';

import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { CalendarService } from '../../Services';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-tag',
  standalone: true,
  imports: [MatIconModule,CommonModule, MatRippleModule, NgStyle, DatePipe, NgIf],
  templateUrl: './event-tag.component.html',
  styleUrls: ['./event-tag.component.scss'],
})
export class EventTagComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject();
  events: CalendarEvent[] = [];

  @Input() event!: CalendarEvent;
  @Input() language: Languages = Languages.SPANISH;
  languageModel: LanguageModel = SPANISH;

  @Output() reloadCalendar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.languageModel = LANGUAGES[this.language];
    this.loadEvents(); // Llama al método loadEvents() cuando se inicie el componente
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }


  loadEvents() {
    this.calendarService.getAllEvents()
      .subscribe(
        (events: CalendarEvent[]) => {
          this.events = events;
          console.log('Eventos cargados:', events); // Agrega un console.log() para verificar
        },
        (error) => {
          console.error('Error al cargar los eventos:', error);
        }
      );
  }
  
  openEditModal(eventItem: CalendarEvent) {
    const eventModel: CalendarEventForm = {
      ...eventItem,
      isEdit: true,
      language: this.language,
    };
  
    const dialogRef = this.dialog.open(EventFormComponent, {
      minWidth: '40%',
      maxHeight: '80vh',
      data: eventModel,
    });
  
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result: CalendarEvent) => {
        if (result === undefined) {
          return;
        }
  
        //==================================================================================================
        // AQUI IRIA EL CODIGO PARA ACTUALIZAR EL EVENTO EN EL BACKEND
        //==================================================================================================
  
        const response = this.calendarService.updateEvent(eventItem.id, result);
  
        if (!response) {
          console.error(
            this.languageModel.errorMessages[ErrorKeys.UpdateEventError]
          );
        }
  
        //==================================================================================================
  
        this.reloadCalendar.emit(true);
      });
  }
  
  deleteEvent(eventItem: CalendarEvent) {
    //==================================================================================================
    // AQUI IRIA EL CODIGO PARA ELIMINAR EL EVENTO DEL BACKEND
    //==================================================================================================
  
    this.calendarService.deleteEvent(eventItem.id)
      .subscribe((response) => {
        if (!response) {
          console.error(
            this.languageModel.errorMessages[ErrorKeys.DeleteEventError]
          );
        } else {
          this.reloadCalendar.emit(true);
        }
      });
  
    //==================================================================================================
  }
  
  
}
