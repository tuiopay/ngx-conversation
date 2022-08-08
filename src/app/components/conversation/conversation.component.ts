import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject, Input, Injector,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';
import { FsFormDirective } from '@firestitch/form';
import { FsFile } from '@firestitch/file';
import { FsGalleryConfig, GalleryLayout } from '@firestitch/gallery';
import { list } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';

import { forkJoin, Observable, of, Subject, timer, iif } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, IConversation, IConversationParticipant } from '../../interfaces';
import { ConversationItemState, ConversationItemType } from '../../enums';
import { ConversationService } from '../../services';


@Component({
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {

  @ViewChild('nameForm', { read: FsFormDirective })
  public nameForm: FsFormDirective;

  @ViewChild('messageForm', { read: FsFormDirective })
  public messageForm: FsFormDirective;

  public conversation: IConversation = null;
  public message = '';
  public files: FsFile[] = [];
  public conversationItems;
  public activeConversationParticipant;
  public conversationParticipants: IConversationParticipant[] = [];
  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public account: Account;

  @Input() public isAdmin = true;

  // public get isAdmin(): boolean {
  //   return this._experienceService.isExperienceOrganization;
  // }

  private _destroy$ = new Subject();
  private _conversationService: ConversationService;
  private _disableItemsAutoLoad = false;

  // (“Apple”) key is not considered a modifier key—instead, we should listen on keydown/keyup, so
  // Cmd key has own event
  private _keysPressed: KeyboardEvent[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversation: IConversation,
      conversationService: ConversationService,
      account: Account,
    },
    private _dialogRef: MatDialogRef<ConversationComponent>,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
    private _prompt: FsPrompt,
  ) {}

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public ngOnInit(): void {
    this._conversationService = this._data.conversationService;
    this.account = this._data.account;
    this._dialogRef.addPanelClass('conversation');

    this.loadConversation$()
      .pipe(
        tap(() => {
          timer(0, 5000)
            .pipe(
              filter(() => !this._disableItemsAutoLoad),
              takeUntil(this._destroy$),
            )
            .subscribe((iterator) => {
              this.loadConversationItems(iterator === 0);
            });
        }),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public loadConversationItems(unreadUpdate = false): void {
    this.conversationItems = this.conversationItems || [];
    const maxConversationItemId = this.conversationItems[0]?.id;

    this._conversationService.conversationConfig.conversationItemsGet(this.conversation.id, {
      conversationParticipants: true,
      conversationParticipantAccounts: true,
      objects: true,
      conversationItemFiles: true,
      maxConversationItemId,
      order: 'conversation_item_id,desc',
    })
      .pipe(
        map((response) => {
          return response.conversationItems
            .map((conversationItem) => {
              return {
                ...conversationItem,
                galleryConfig: {
                  map: (conversationItemFile) => {
                    return {
                      name: conversationItemFile.file.name,
                      preview: conversationItemFile.file.preview ?.small,
                      url: conversationItemFile.file.preview ?
                        conversationItemFile.file.preview.actual :
                        conversationItemFile.file.name,
                      index: conversationItemFile.id,
                    };
                  },
                  info: false,
                  thumbnail: {
                    heightScale: 0.7,
                    width: 200,
                  },
                  layout: GalleryLayout.Flow,
                  toolbar: false,
                  zoom: false,
                  fetch: () => {
                    return of(conversationItem.conversationItemFiles);
                  },
                } as FsGalleryConfig,
              };
            });
        }),
        tap((conversationItems) => {
          if (this.activeConversationParticipant && conversationItems.length) {
            const data = {
              id: this.activeConversationParticipant.id,
              conversationId: this.activeConversationParticipant.conversationId,
              lastViewedConversationItemId: conversationItems[0].id,
            };

            this._conversationService.conversationConfig.conversationParticipantSave(this.conversation.id, data)
              .subscribe(() => {
                if (unreadUpdate) {
                  //this._notificationService.reload();
                }
              });
          }

        }),
      )
      .subscribe((conversationItems) => {
        this.conversationItems = [
          ...conversationItems,
          ...this.conversationItems,
        ];

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
    this._disableItemsAutoLoad = true;
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
          this._disableItemsAutoLoad = false;
          this.loadConversationItems();
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

  public trackByconversationItem(index, conversationItem) {
    return conversationItem.id;
  }

  public conversationItemDelete(conversationItem): void {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure that you want to delete the message?',
    })
      .pipe(
        switchMap(() => {
          return this._conversationService.conversationConfig.conversationItemSave({
            conversationId: conversationItem.conversationId,
            id: conversationItem.id,
            state: ConversationItemState.Deleted,
          });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.conversationItems = this.conversationItems
          .filter((conversationItem_) => {
            return conversationItem_.id !== conversationItem.id;
          });
        this._cdRef.markForCheck();
      });
  }

  public fileDownload(conversationItem, fileItem): void {
    this._conversationService.conversationConfig.conversationItemFileDownload(conversationItem, fileItem.id);
  }

  public messageKeydown(event: KeyboardEvent) {
    this._keysPressed.push(event);
    const action = this._keyAction();
    if (action) {
      event.preventDefault();
    }
  }

  public messageKeyup(event: KeyboardEvent) {
    let action = this._keyAction();

    switch (action) {
      case 'send':
        this.messageForm.triggerSubmit();
        break;
      case 'newLine':
        this.message += '\n';
        break;
    }

    this._keysPressed = [];
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

  public getActiveConversationParticipant(): Account {
    return this.conversation.conversationParticipants
      .find((conversationParticipant) => {
        return conversationParticipant.accountId === this.account.id;
      });
  }

  public loadConversation() {
    this.loadConversation$()
      .subscribe();
  }

  public loadConversation$(): Observable<any> {
    return this._conversationService.conversationGet(this._data.conversation.id, {
      conversationParticipantCounts: true,
      conversationParticipants: true,
      conversationParticipantLimit: 3,
      conversationParticipantOrder: 'activity_date,desc',
      conversationParticipantAccounts: true,
    })
      .pipe(
        tap((conversation) => {
          this.conversation = conversation;
          this._cdRef.markForCheck();
        }),      
      );
  }

  private _keyAction() {
    let action: 'send' | 'newLine' = null;

    const metaClicked = this._keysPressed.some((item) => item.metaKey);
    const ctrlClicked = this._keysPressed.some((item) => item.ctrlKey);
    const enterClicked = this._keysPressed.some((item) => item.key === 'Enter');

    if (enterClicked) {
      if (metaClicked || ctrlClicked) {
        action = 'newLine';
      } else {
        action = 'send';
      }
    }

    return action;
  }

}
