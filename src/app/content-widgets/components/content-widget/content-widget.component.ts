import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FsMessage } from '@firestitch/message';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';


@Component({
  templateUrl: './content-widget.component.html',
  styleUrls: ['./content-widget.component.scss'],
})
export class FsContentWidgetComponent implements OnInit {

  public contentWidget;
  public htmlEditorConfig: FsHtmlEditorConfig;
  
  private _saveContentWidget: (contentWidget: any) => Observable<any>;

  public constructor(
    private _dialogRef: MatDialogRef<FsContentWidgetComponent>,
    private _message: FsMessage,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ) {
  }

  public ngOnInit(): void {
    this._saveContentWidget = this._data.saveContentWidget;
    this.htmlEditorConfig = this._data.htmlEditorConfig || {};
    this.contentWidget = { ...this._data.contentWidget };
  }

  public save = () => {
    return this._saveContentWidget(this.contentWidget)
      .pipe(
        tap((contentWidget) => {
          this.contentWidget = { ...this.contentWidget, ...contentWidget };
          this._dialogRef.close(this.contentWidget);
          this._message.success('Saved Changes');
        }),
      );
  }

}
