import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { index } from '@firestitch/common';
import { FsMessage } from '@firestitch/message';

import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ConversationParticipantType } from '../../enums';
import { ConversationStates } from '../../consts';
import { Conversation } from '../../types';
import { ConversationService } from '../../services';


@Component({
  templateUrl: './conversation-settings.component.html',
  styleUrls: ['./conversation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationSettingsComponent implements OnInit, OnDestroy {

  public conversation: Conversation = null;
  public ConversationStates = ConversationStates;
  public tab;
  public conversationStates = index(ConversationStates, 'name', 'value');

  private _conversationService: ConversationService;
  private _destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationService: ConversationService,
      conversation: Conversation,
      tab: string,
    },
    private _dialogRef: MatDialogRef<ConversationSettingsComponent>,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) { }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public ngOnInit(): void {
    this.tab = this._data.tab;
    this._conversationService = this._data.conversationService;
    this.conversation = {
      ...this._data.conversation,
    };
  }

  public conversationParticipantFetch = (keyword) => {
    return this.conversationService.conversationConfig.accountsGet({
      keyword,
      avatars: true,
    })
      .pipe(
        map((response) => {
          return response.accounts
          .map((account) => ({
            type: ConversationParticipantType.Account,
            account,
          }));
        }),
      );
  };

  public save = (): Observable<any> => {
    return of(true)
      .pipe(
        switchMap(() => {
          return this.conversationService.conversationConfig.conversationSave(this.conversation)
            .pipe(
              tap((response) => {
                this.conversation = {
                  ...this.conversation,
                  ...response,
                };
                this._cdRef.markForCheck();
              }),
            );
        }),
      )
      .pipe(
        tap(() => {
          this._dialogRef.close();
          this._message.success('Saved Changes');
        }),
      );
  };

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
