import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject, TemplateRef,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsFormDirective } from '@firestitch/form';
import { FsFile } from '@firestitch/file';
import { list } from '@firestitch/common';

import { forkJoin, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, Conversation, ConversationConfig } from '../../types';
import { ConversationItemType, ConversationState } from '../../enums';
import { ConversationService } from '../../services';
import { ConversationItemsComponent } from '../conversation-items';
import { MatInput } from '@angular/material/input';


@Component({
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {

  @ViewChild(ConversationItemsComponent)
  public conversationItems: ConversationItemsComponent;

  @ViewChild(FsFormDirective)
  public messageForm: FsFormDirective;

  @ViewChild(MatInput, { static: true })
  public input: MatInput;

  public conversation: Conversation = null;
  public message = '';
  public ConversationState = ConversationState;
  public files: FsFile[] = [];
  public sessionConversationParticipant;
  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public account: Account;
  public joined = false;

  private _destroy$ = new Subject();
  private _conversationService: ConversationService;

  private _wsSubscriptions: Subscription[] = [];
  public typing = {state: 'none', name: '', accounts: []};


  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversation: Conversation,
      conversationService: ConversationService,
      account: Account,
    },
    private _dialogRef: MatDialogRef<ConversationComponent>,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) { }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public get conversationConfig(): ConversationConfig {
    return this._conversationService.conversationConfig;
  }

  public ngOnInit(): void {
    this._conversationService = this._data.conversationService;
    this.account = this._data.account;
    this._dialogRef.addPanelClass('conversation');

    this._conversationService.conversationConfig
      .conversationParticipantSession(this._data.conversation)
      .subscribe((conversationParticipant) => {
        this.sessionConversationParticipant = conversationParticipant;
        this._cdRef.markForCheck();
      });

    this.loadConversation$()
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public saveConversation(conversation): Observable<any> {
    return this._conversationService.conversationConfig.conversationSave(conversation)
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
        }),
      );
  }

  public conversationItemCreate(config) {
    this.conversationItems.autoload = false;
    return this._conversationService
      .conversationConfig.conversationItemSave({
        conversationId: this.conversation.id,
        message: config.message,
        type: ConversationItemType.Message,
      })
      .pipe(
        switchMap((conversationItem) => {
          return this.files.length ?
            forkJoin(
              this.files.map((fsFile: FsFile) => {
                return this._conversationService.conversationConfig.conversationItemFilePost(
                  conversationItem,
                  fsFile.file
                );
              }),
            )
            : of(true);
        }),
        tap(() => {
          this.conversationItems.load();
        }),
        finalize(() => {
          this.conversationItems.autoload = false;
        }),
      );
  }

  public fileSelect(fsFiles: FsFile[]) {
    this.files = [
      ...this.files,
      ...fsFiles,
    ];

    this.messageForm.dirty();
  }

  public messageKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.messageForm.triggerSubmit();
    }
  }

  public messageSend = () => {
    return of(this.message.trim())
      .pipe(
        switchMap((message) => !this.files.length && message.length === 0 ? throwError(false) : of(message)),
        switchMap((message) => this.conversationItemCreate({ message })),
        tap(() => {
          this.conversationService.sendMessageNotice(this.conversation.id, this.account.id);

          this.message = '';
          this.files = [];
          this._cdRef.markForCheck();
        }),
      );
  };


  private _unsubscribe(): void {
    this._wsSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public ngOnDestroy(): void {
    this._unsubscribe();

    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadConversation() {
    this.loadConversation$()
      .subscribe();
  }

  public loadConversationItems() {
    this.conversationItems.load();
  }

  public filterChanged(event) {
    this.conversationItems.query = event.query;
    this.conversationItems.reload();
  }

  public conversationJoin() {
    this.conversationConfig.conversationParticipantAdd(this.conversation, {
      accountIds: [this.account.id]
    })
    .subscribe(() => {
      this.conversationChange();
    });
  }

  public conversationChange() {
    this.loadConversation();
    this.loadConversationItems();
  }

  public loadConversation$(): Observable<Conversation> {
    return forkJoin({
      conversation: this._conversationService
        .conversationGet(this._data.conversation.id, {
          conversationParticipantCounts: true,
          conversationParticipants: true,
          conversationParticipantLimit: 3,
          conversationParticipantOrder: 'read_date,desc',
          conversationParticipantAccounts: true,
        }),
        conversationParticipants: this.conversationConfig
        .conversationParticipantsGet(this._data.conversation, {
          accountId: this.account.id,
        }),
      })
      .pipe(
        tap((response) => {
          this._unsubscribe();

          this.joined = response.conversationParticipants.conversationParticipants.length > 0;
          this.conversation = response.conversation;

          // handle typing updates
          this._wsSubscriptions.push(this.conversationService.onTypingNotice(this.conversation.id)
            .subscribe((message) => {
              if (message.data.isTyping) {
                if (!this.typing.accounts.some((el) => el.id === message.data.accountId )) {
                  this.typing.accounts.push({id: message.data.accountId, name: message.data.accountName});
                }
              } else {
                this.typing.accounts = this.typing.accounts.filter((el) => el.id !== message.data.accountId );
              }
              this._updateTypingState();
            })
          );

          // handle new messages
          this._wsSubscriptions.push(this.conversationService.onMessageNotice(this.conversation.id)
            .subscribe((message) => {
              this.conversationItems.reload();
            })
          );

          this._cdRef.markForCheck();
        }),
        map((response) => response.conversation) ,
      );
  }


  private _updateTypingState() {
    this.typing.accounts = this.typing.accounts.filter(function (el) {
      return el != null;
    });


    if (this.typing.accounts.length === 0) {
      this.typing.state = 'none';
      this.typing.name = '';
    } else if (this.typing.accounts.length === 1) {
      this.typing.state = 'single';
      this.typing.name = this.typing.accounts[0].name;
    } else {
      this.typing.state = 'multiple';
      this.typing.name = '';
    }

    this._cdRef.markForCheck();
  }


  public typingStart() {
    this.conversationService.sendTypingStartNotice(this.conversation.id, this.account.id);
  }

}
