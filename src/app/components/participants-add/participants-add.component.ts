import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { forkJoin, pipe, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ConversationService } from 'src/app/services';
import { Account, ConversationConfig, IConversationParticipant } from '../../interfaces';


@Component({
  templateUrl: './participants-add.component.html',
  styleUrls: ['./participants-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsAddComponent implements OnInit, OnDestroy {

  public accounts: Account[] = [];
  public conversationId: number;

  private _destroy$ = new Subject<void>();
  private _conversationService: ConversationService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationParticipants: IConversationParticipant[];
      conversationId: number;
      conversationService: ConversationService,
    },
    private _dialogRef: MatDialogRef<ParticipantsAddComponent>,
    private _message: FsMessage,
  ) { }

  public ngOnInit(): void {
    this.conversationId = this._data.conversationId;
    this._conversationService = this._data.conversationService;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return forkJoin(this.accounts.map((account) => {
      return this._conversationService.conversationConfig.conversationParticipantSave(this.conversationId, 
        {
          accountId: account.id,
        })
    }))
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(response);
        }),
      );
  }

  public accountsFetch = (keyword) => {
    return this._conversationService.conversationConfig.accountsGet({
      keyword,
      avatars: true,
      notConversationParticipant: this.conversationId,
      limit: 30,
    })
      .pipe(
        map((response) => response.accounts)
      );
  }

}
