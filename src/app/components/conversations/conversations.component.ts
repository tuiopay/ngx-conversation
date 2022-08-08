import {
  Component, OnInit, ViewChild,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { format } from '@firestitch/date';

import { map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ConversationCreateComponent, ConversationComponent } from '../../components';
import { Account, ConversationConfig, ConversationFilter, IConversation } from '../../interfaces';
import { ConversationState } from '../../enums';
import { ConversationService } from '../../services';


@Component({
  selector: 'fs-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversationService],
})
export class ConversationsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  @Input() public isAdmin = true;
  @Input() public config: ConversationConfig;
  @Input() public account: Account;

  public listConfig: FsListConfig;
  public filters: ConversationFilter[] = [];
  public selectedFilter: ConversationFilter;

  private _destroy$ = new Subject<void>();
  private _conversationConfig: ConversationConfig;

  constructor(
    private _dialog: MatDialog,
    private _message: FsMessage,
    private _conversationService: ConversationService,
  ) {}

  public ngOnInit(): void {
    this._conversationService.conversationConfig = this.config;
    this._conversationConfig = this.config;
    this.filters = [
      { name: 'Open', type: 'open', icon: 'chat' },
      { name: 'Closed', type: 'closed', icon: 'chat_bubble' },
    ];

    if (this.isAdmin) {
      this.filters.unshift(
        { name: this.account.name, type: 'account', image: this.account.image.tiny },
      );
    }

    this.filterLoad();
    this.filterSelect(this.filters[0]);

    this.listConfig = {
      status: false,
      loadMore: true,
      rowEvents: {
        click: (event) => {
          this.conversationOpen(event.row);
        },
      },
      noResults: {
        message: 'No conversations found',
      },
      fetch: (query) => {
        query = {
          ...query,   
          lastConversationItems: true,
          lastConversationItemConversationParticipants: true,
          lastConversationItemConversationParticipantsAccounts: true,
          unreads: true,
          conversationParticipantCounts: true,
          order: 'activityDate,desc',
        };

        switch (this.selectedFilter.type) {
          case 'account':
            query.conversationParticipantAccountId = this.account.id;
            break;

          case 'closed':
            query.state = ConversationState.Closed;
            break;

          case 'open':
            query.state = ConversationState.Open;
            break;
        }

        return this._conversationConfig.conversationsGet(query)
          .pipe(
            tap(() => {
              this.filterLoad();
            }),
            map((response) => {
              return { data: response.conversations, paging: response.paging };
            }),
          );
      },
    };

    if (this.isAdmin) {
      this.listConfig.rowActions = [
        {
          click: (data) => {
            return this._conversationConfig.conversationDelete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete',
        },
      ];
    }
  }

  public conversationParticipantsChange(): void {
    this.listComponent.reload();
  }

  public filterSelect(filter): void {
    this.selectedFilter = filter;
    if (this.listComponent) {
      this.listComponent.reload();
    }
  }

  public filterLoad(): void {
    const statsFilters: any = {
      account: true,
      open: true,
      closed: true,
    };

    if (!this.isAdmin) {
      statsFilters.accountId = this.account.id;
    }

    // this._conversationConfig.conversationsStats(statsFilters)
    //   .subscribe((data) => {
    //     Object.keys(data)
    //       .forEach((type) => {
    //         const filter = this.filters
    //           .find((filter_: ConversationFilter) => (filter_.type === type)) as ConversationFilter;

    //         if (filter) {
    //           const item = data[type];
    //           filter.unread = item.unread;
    //           filter.count = item.count;
    //         }
    //       });

    //     this._cdRef.markForCheck();
    //   });
  }

  public conversationCreate(conversation: IConversation = { id: null }): void {
    const dialogRef = this._dialog.open(ConversationCreateComponent, {
      autoFocus: true,
      data: { conversation },
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response) {
          this.listComponent.reload();
          this.conversationOpen(response);
        }
      });
  }

  public conversationStart(conversation: IConversation = { id: null }): void {
    conversation.name = format(new Date());
    // if (!this.isAdmin) {
    //   conversation.participantsEnvironmentId = this._sessionService.environmentId();
    // }

    this._conversationConfig.conversationSave(conversation)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._message.success('Saved Changes');
        this.listComponent.reload();
        this.conversationOpen(response);
      });
  }

  public conversationOpen(conversation: IConversation): void {
    this._dialog.open(ConversationComponent, {
      autoFocus: true,
      data: { 
        conversation,
        conversationService: this._conversationService,
        account: this.account,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.listComponent.reload();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
