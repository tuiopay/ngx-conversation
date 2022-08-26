import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject,   
} from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsFormDirective } from '@firestitch/form';
import { FsFile } from '@firestitch/file';
import { list } from '@firestitch/common';

import { forkJoin, fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, finalize, map, switchMap, tap } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, Conversation, ConversationConfig } from '../../types';
import { ConversationItemType, ConversationState } from '../../enums';
import { ConversationService } from '../../services';
import { ConversationItemsComponent } from '../conversation-items';


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
      .conversationParticipantSession(this._data.conversation.id)
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
                return this._conversationService.conversationConfig.conversationItemFilePost(conversationItem, fsFile.file);
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
    return this.conversationItemCreate({ message: this.message.trim() })
      .pipe(
        tap(() => {
          this.message = '';
          this.files = [];
          this._cdRef.markForCheck();
        }),
      );
  };

  public ngOnDestroy(): void {
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
    this.conversationConfig.conversationParticipantAdd(this.conversation.id, {
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
        .conversationParticipantsGet(this._data.conversation.id, {
          accountId: this.account.id,
        }),
      })
      .pipe(        
        tap((response) => {
          this.joined = response.conversationParticipants.conversationParticipants.length > 0;
          this.conversation = response.conversation;
          this._cdRef.markForCheck();
        }), 
        map((response) => response.conversation) ,    
      );
  }

}
