import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker-dialog',
  standalone: true,
  styles: [
    `:host {
      display: block;
      padding: 20px;
      max-width: 300px;
      max-height: 300px;
      overflow: hidden;
      box-sizing: border-box;
    }
    h2 {
      margin-top: 0;
    }`
  ],
  imports: [CommonModule, MatButtonModule, FormsModule],
  template: `
    <h4>Select a color</h4>
    <input type="color" [(ngModel)]="selectedColor" />
    <br /><br />
    <button mat-button (click)="confirmColor()">Confirm</button>
  `,
})
export class ColorPickerDialogComponent {
  selectedColor: string;

  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentColor: string }
  ) {
    this.selectedColor = data.currentColor;
  }

  confirmColor() {
    this.dialogRef.close(this.selectedColor);
  }
}