import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {  LanguageModel, PageElementsTextsKeys, SPANISH } from '../../Models';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent implements OnInit {
  
  
  language: LanguageModel = SPANISH;
  textsKeys = PageElementsTextsKeys;


  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LanguageModel
  ) {}

  ngOnInit(): void {
    this.language = this.data;
  }

  confirm() {
    this.dialogRef.close(true);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
