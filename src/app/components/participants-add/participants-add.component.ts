import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ConversationService } from '../../services';
import { Account, Conversation, ConversationParticipant } from '../../types';


@Component({
  templateUrl: './participants-add.component.html',
  styleUrls: ['./participants-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsAddComponent implements OnInit, OnDestroy {

  public accounts: Account[] = [];
  public conversation: Conversation;

  private _destroy$ = new Subject<void>();
  private _conversationService: ConversationService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationParticipants: ConversationParticipant[];
      conversation: Conversation;
      conversationService: ConversationService,
    },
    private _dialogRef: MatDialogRef<ParticipantsAddComponent>,
    private _message: FsMessage,
  ) { }

  public ngOnInit(): void {
    this.conversation = this._data.conversation;
    this._conversationService = this._data.conversationService;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public save = () => {
    return this._conversationService.conversationConfig
      .conversationParticipantAdd(this.conversation,
        {
          accountIds: this.accounts.map((account) => account.id),
        })
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(response);

          this._conversationService.sendMessageNotice(this.conversation.id);
        }),
      );
  };

  public accountsFetch = (keyword: string) => {
    return this._conversationService.conversationConfig.accountsGet(
      this.conversation,
      {
        keyword,
        avatars: true,
        limit: 30,
      })
      .pipe(
        map((response) => response.accounts),
      );
  };

}
