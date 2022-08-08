import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './object-attach.component.html',
})
export class ObjectAttachComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ObjectAttachComponent>,
  ) { }

  public objectSelected(object): void {
    this._dialogRef.close(object);
  }

  public close(): void {
    this._dialogRef.close(null);
  }
}
