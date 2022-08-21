import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, Input,
} from '@angular/core';

import { FsGalleryConfig, GalleryLayout } from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';

import { of, Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Account, Conversation, ConversationItem, ConversationParticipant } from '../../types';
import { ConversationItemType, ConversationRole } from '../../enums';
import { ConversationService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { ConversationReadParticipantsDialogComponent } from '../conversation-read-participants-dialog';


@Component({
  selector: 'app-conversation-items',
  templateUrl: './conversation-items.component.html',
  styleUrls: ['./conversation-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationItemsComponent implements OnInit, OnDestroy {

  @Input() public conversation: Conversation;
  @Input() public account: Account;
  @Input() public sessionConversationParticipant: ConversationParticipant;
  @Input() public conversationService: ConversationService;

  public autoload = true;
  public conversationParticipants: ConversationParticipant[] = [];
  public ConversationItemType = ConversationItemType;
  public lastConversationItem: ConversationItem;
  public conversationItems: (ConversationItem & { 
    canDelete?: boolean,
    galleryConfig?: FsGalleryConfig,
  })[] = [];

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _prompt: FsPrompt,
    private _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    timer(0, 5000)
      .pipe(
        filter(() => this.autoload),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.load();
        this._cdRef.markForCheck();
      });
  }

  public load(): void {
    this.autoload = false;
    const maxConversationItemId = this.conversationItems[0]?.id;

    this.conversationService.conversationConfig.conversationItemsGet(this.conversation.id, {
      conversationParticipants: true,
      conversationParticipantAccounts: true,
      conversationParticipantsAddedCounts: true,
      conversationParticipantsRemovedCounts: true,
      conversationParticipantsReadCounts: true,
      conversationParticipantsReadCountNotCreator: true,
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
                canDelete: this.canDelete(conversationItem),
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
      )
      .subscribe((conversationItems) => {
        this.autoload = true;
        this.conversationItems = [
          ...conversationItems,
          ...this.conversationItems,
        ];

        const lastConversationItem = this.conversationItems[0];
        if(lastConversationItem && lastConversationItem !== this.lastConversationItem) {
          this.conversationService.conversationConfig.conversationRead(this.conversation, lastConversationItem.id)
          .subscribe();
        }

        this.lastConversationItem = lastConversationItem;
        this._cdRef.markForCheck();
      });
  }
  
  public openReadParticipants(conversationItem) {
    this._dialog.open(ConversationReadParticipantsDialogComponent, {
      data: {
        conversationItem, 
        conversationService: this.conversationService,
        account: this.account,
      },
    });
  }

  public canDelete(conversationItem) {
    return conversationItem.conversationParticipant?.accountId === this.account.id ||
      this.conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1;
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
          return this.conversationService.conversationConfig.conversationItemDelete(conversationItem);
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
    this.conversationService.conversationConfig.conversationItemFileDownload(conversationItem, fileItem.id);
  }

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

}
