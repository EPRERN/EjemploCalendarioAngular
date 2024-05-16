import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  ENGLISH,
  EventFormTextsKeys,
  FormFieldKeys,
  LANGUAGES,
  LanguageModel,
  TimeDateModal,
} from '../../Models';
@Component({
  selector: 'app-time-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './time-modal.component.html',
  styleUrls: ['./time-modal.component.scss'],
})
export class TimeModalComponent implements OnInit {
  form!: FormGroup;
  language: LanguageModel = ENGLISH;
  formTextsKeys = EventFormTextsKeys;

  title: string = '';
  date: string = '';

  hora:string = '1'
  minutos:string = '9'

  model = {
    hour: 0,
    minute: 0,
  };

  hours: number[] = Array.from({ length: 24 }, (_, index) => index);
  minutes: number[] = Array.from({ length: 60 }, (_, index) => index);

  constructor(
    public dialogRef: MatDialogRef<TimeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeDateModal
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.dialogRef.close(
      `${this.model.hour.toString().padStart(2, '0')}:${this.model.minute
        .toString()
        .padStart(2, '0')}`
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /** Inicializa el formulario. */
  private initForm() {
    if (this.data) {
      this.language = LANGUAGES[this.data.language];

      this.title = this.language.eventFormTexts[FormFieldKeys.TimeModalTitle];
      this.date = this.data.date.toLocaleDateString();

      this.model.hour = Number(this.data.time = '12') 
      this.model.minute = Number(this.data.time = '12')

      if (this.data.time != null && this.data.time != '') {
        this.model.hour = Number(this.data.time.split(':')[0]);
        this.model.minute = Number(this.data.time.split(':')[1]);
      }
    }
  }
}
