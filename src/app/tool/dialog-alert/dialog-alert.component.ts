import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent implements OnInit {
  typeIn: string;
  theData: any;

  theForbidden;
  matchForbidden = false;
  myInput = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<DialogAlertComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.theData = this.data;
    this.typeIn = this.data['typeIn'];
    if (this.typeIn === 'custom') {
      this.theForbidden = this.theData['forbidden'];
    }
  }

  doConfirm() {
    const val = this.myInput.value.trim();
    if (this.theForbidden) {
      for (const value of this.theForbidden) {
        if (value.toLowerCase() === val.toLowerCase()) {
          return this.matchForbidden = true;
        }
      }
    }
    return this.dialogRef.close(val);
  }

  doSearch() {
    return this.dialogRef.close(true);
  }
}
