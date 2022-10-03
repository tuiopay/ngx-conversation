import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, Input,
} from '@angular/core';

import { FsGalleryConfig, FsGalleryItem, GalleryLayout, GalleryThumbnailSize, MimeType } from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';

import { Observable, of, Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Account, Conversation, ConversationItem, ConversationParticipant } from '../../types';
import { ConversationItemState, ConversationItemType, ConversationRole, ConversationState } from '../../enums';
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
  @Input() public query = {};
  @Input() public sessionConversationParticipant: ConversationParticipant;
  @Input() public conversationService: ConversationService;

  public autoload = true;
  public MimeType = MimeType;
  public conversationParticipants: ConversationParticipant[] = [];
  public ConversationItemType = ConversationItemType;
  public lastConversationItem: ConversationItem;
  public ConversationItemState = ConversationItemState;
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
    this.load();

    timer(0, 5000)
      .pipe(
        filter(() => this.autoload),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        // if no socket connection fall pack to polling
        if (!this.conversationService.hasWebSocketConnection()) {
          this.load();
          this._cdRef.markForCheck();
        }
      });
  }

  public reload(): void {
    this.conversationItems = [];
    this.lastConversationItem = null;
    this.load();
  }

  public load(): void {
    this.autoload = false;
    const maxConversationItemId = this.conversationItems[0]?.id;

    this.conversationService.conversationConfig
    .conversationItemsGet(this.conversation.id, {
      ...this.query,
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
                  info: false,
                  thumbnail: {
                    heightScale: 0.7,
                    width: 200,
                    size: GalleryThumbnailSize.Cover,
                  },
                  layout: GalleryLayout.Flow,
                  toolbar: false,
                  zoom: false,
                  fetch: (query): Observable<FsGalleryItem[]> => {
                    return of(conversationItem.conversationItemFiles
                      .map((conversationItemFile) => {
                        return {
                          name: conversationItemFile.file.name,
                          preview: conversationItemFile.file.preview?.small,
                          url: conversationItemFile.file.preview?.actual,
                          index: conversationItemFile.id,
                          data: conversationItemFile,
                          extension: conversationItemFile.file.extension,
                        };
                      }));
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
        if (lastConversationItem && lastConversationItem !== this.lastConversationItem) {
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
    if (conversationItem.state !== ConversationItemState.Active) {
      return false;
    }

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
          return this.conversationService.conversationConfig.conversationItemDelete(conversationItem)
          .pipe(
            tap(() => {
              this.conversationService.sendMessageNotice(this.conversation.id, this.account.id);
            })
          );
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        conversationItem.state = ConversationState.Deleted;
        this.reload();
        this._cdRef.markForCheck();
      });
  }

  public fileDownload(conversationItem, fileItem): void {
    this.conversationService.conversationConfig.conversationItemFileDownload(conversationItem, fileItem.id);
  }

  public filesDownload(conversationItem: ConversationItem): void {
    conversationItem.conversationItemFiles
    .forEach((conversationItemFile) => {
      this.conversationService.conversationConfig.conversationItemFileDownload(
        conversationItem,
        conversationItemFile.id
      );
    });
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
