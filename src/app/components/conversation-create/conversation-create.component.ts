import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ConversationConfig, Conversation } from '../../types';



@Component({
  templateUrl: './conversation-create.component.html',
  styleUrls: ['./conversation-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationCreateComponent implements OnInit, OnDestroy {

  public conversation: Conversation = null;
  
  private _conversationConfig: ConversationConfig;
  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ConversationCreateComponent>,
    private _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.conversation = { ...this._data.conversation };
    this._cdRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return this._conversationConfig.conversationSave(this.conversation)
      .pipe(
        tap((conversation) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(conversation);
        }),
      );
  };

}
