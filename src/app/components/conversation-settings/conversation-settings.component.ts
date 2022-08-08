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
import { ConversationConfig, IConversation } from '../../interfaces';


@Component({
  templateUrl: './conversation-settings.component.html',
  styleUrls: ['./conversation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationSettingsComponent implements OnInit, OnDestroy {

  public conversation: IConversation = null;
  public ConversationStates = ConversationStates;
  public conversationStates = index(ConversationStates, 'name', 'value');

  private _conversationConfig: ConversationConfig;
  private _destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationConfig: ConversationConfig,
      conversation: IConversation,
    },
    private _dialogRef: MatDialogRef<ConversationSettingsComponent>,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) { }

  public ngOnInit(): void {
    this._conversationConfig = this._data.conversationConfig;
    this.conversation = {
      ...this._data.conversation,
    };

    // this._conversationData.get(this._data.conversation.id, {
    //   conversationParticipants: true,
    //   conversationParticipantAccounts: true,
    // })
    //   .pipe(
    //     tap((conversation) => {
    //       this.conversation = conversation;
    //       this.activeConversationParticipant = this.getActiveConversationParticipant();

    //       timer(0, 5000)
    //         .pipe(
    //           takeUntil(this._destroy$),
    //         )
    //         .subscribe(() => {
    //           this.loadConversationItems();
    //         });
    //     }),
    //   )
    //   .subscribe(() => {
    //     this._cdRef.markForCheck();
    //   });
  }

  public conversationParticipantFetch = (keyword) => {
    return this._conversationConfig.accountsGet({
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

  public save = () => {
    return this.saveConversation(this.conversation);
  };

  public saveConversation(conversation): Observable<any> {
    return of(true)
      .pipe(
        // switchMap(() => {
        //   return this._conversationConfig
        //   .conversationParticipantBulk(this.conversation.id, {
        //       accountId: this.conversation.conversationParticipants
        //         .map((conversationParticipant) => (conversationParticipant.account.id)),
        //       addAllParents: this.conversation.addAllParents,

        //       // TODO ???
        //     })
        //     .pipe(
        //       tap((conversationParticipants) => {
        //         this.conversation.conversationParticipants = conversationParticipants;
        //       }),
        //     );
        // }),
        switchMap(() => {
          // TODO ???
          return this._conversationConfig.conversationSave(conversation)
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
          this._dialogRef.close(this.conversation);
          this._message.success('Saved Changes');
        }),
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
