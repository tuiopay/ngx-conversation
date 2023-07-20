import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject, TemplateRef, Input, Output, EventEmitter,
} from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { FsFormDirective } from '@firestitch/form';
import { FsFile } from '@firestitch/file';
import { list } from '@firestitch/common';

import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, Conversation, ConversationConfig } from '../../types';
import { ConversationItemType, ConversationState } from '../../enums';
import { ConversationService } from '../../services';
import { ConversationItemsComponent } from '../conversation-items';
import { MatInput } from '@angular/material/input';
import { ConversationSettingsComponent } from '../conversation-settings';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-conversation-pane',
  templateUrl: './conversation-pane.component.html',
  styleUrls: ['./conversation-pane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationPaneComponent implements OnInit, OnDestroy {

  @Input() public account: Account;
  @Input() public conversation: Conversation;

  @Output() public conversationClose = new EventEmitter();
  @Output() public conversationChange = new EventEmitter();

  @ViewChild(ConversationItemsComponent)
  public conversationItems: ConversationItemsComponent;

  @ViewChild(FsFormDirective)
  public messageForm: FsFormDirective;

  @ViewChild(MatInput, { static: true })
  public input: MatInput;

  public message = '';
  public ConversationState = ConversationState;
  public files: FsFile[] = [];
  public sessionConversationParticipant;
  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public joined = false;
  public inited = false;
  public typing = {state: 'none', name: '', accounts: []};

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
    private _conversationService: ConversationService,
    private _dialog: MatDialog,
  ) { }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public get conversationConfig(): ConversationConfig {
    return this._conversationService.conversationConfig;
  }

  public ngOnInit(): void {
    this.loadConversation(this.conversation);
  }

  public saveConversation(conversation): Observable<any> {
    return this._conversationService.conversationConfig.conversationSave(conversation)
      .pipe(
        tap(() => {
          this._message.success('Saved Changes');
          this.conversationChange.emit();
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
          this.conversationChange.emit();
        }),
      );
  };

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public filterChanged(event) {
    this.conversationItems.query = event.query;
    this.conversationItems.reload();
  }

  public conversationJoin() {
    this.conversationConfig.conversationParticipantAdd(this.conversation, {
      accountIds: [this.account.id]
    })
      .pipe(
        switchMap(() => this.loadConversation$(this.conversation)),
      )
      .subscribe();
  }

  public conversationReload() {
    this.loadConversation$(this.conversation)
      .subscribe();
  }

  public loadConversation$(conversation: Conversation): Observable<{ conversation: Conversation, conversationParticipants: any }> {
    return forkJoin({
      conversation: this._conversationService
        .conversationGet(conversation.id, {
          conversationParticipantCounts: true,
          recentConversationParticipants: true,
          recentConversationParticipantAccounts: true,
          recentConversationParticipantAccountAvatars: true,
        }),
        conversationParticipants: this.conversationConfig
        .conversationParticipantsGet(conversation, {
          accountId: this.account.id,
        }),
      })
      .pipe(
        tap(({ conversation, conversationParticipants }) => {
          this.joined = conversationParticipants.conversationParticipants.length > 0;
          this.conversation = conversation;
          this._cdRef.markForCheck();
        })
      );
  }

  public loadConversation(conversation: Conversation) {
    this.loadConversation$(conversation)
      .pipe(
        tap(() => {
          this.inited = true;
          this._cdRef.markForCheck();

          // handle typing updates
          this.conversationService.onTypingNotice(this.conversation.id)
            .pipe(
              filter((response) => !!response),
              takeUntil(this._destroy$),
            )
            .subscribe((message) => {
              if (message.data.isTyping) {
                if (!this.typing.accounts.some((el) => el.id === message.data.accountId )) {
                  this.typing.accounts.push({id: message.data.accountId, name: message.data.accountName});
                }
              } else {
                this.typing.accounts = this.typing.accounts.filter((el) => el.id !== message.data.accountId );
              }
              this._updateTypingState();
            });

          // handle new messages
          this.conversationService.onMessageNotice(this.conversation.id)
            .pipe(
              takeUntil(this._destroy$),
            ) 
            .subscribe(() => {
              this.conversationItems.reload();
            });
        }),
      )
        .subscribe();
  }

  public openSettings(options: { tab?: string} = { tab: 'settings' }): void {
    this._dialog.open(ConversationSettingsComponent, {
      autoFocus: false,
      data: {
        conversation: this.conversation,
        conversationService: this.conversationService,
        joined: this.joined,
        account: this.account,
        tab: options?.tab || 'settings',
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((conversation) => {
        this.conversation = {
          ...this.conversation,
          ...conversation,
        };
        this.conversationChange.emit();
      });
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
