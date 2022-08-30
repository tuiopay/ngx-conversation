import {
  Component, OnInit, ViewChild,
  ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef, TemplateRef, ContentChild, AfterContentInit,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { format } from '@firestitch/date';

import { map, takeUntil, tap } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

import { ConversationCreateComponent, ConversationComponent } from '../../components';
import { Account, ConversationConfig, ConversationFilter, Conversation } from '../../types';
import { ConversationRole, ConversationState } from '../../enums';
import { ConversationService } from '../../services';
import { ConversationColumnDirective, ConversationHeaderDirective, ConversationSettingsDirective } from '../../directives';


@Component({
  selector: 'fs-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversationService],
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterContentInit {

  @ContentChild(ConversationHeaderDirective, { read: TemplateRef })
  public conversationHeadingTemplate: TemplateRef<any>;

  @ContentChild(ConversationSettingsDirective, { read: TemplateRef })
  public conversationSettingTemplate: TemplateRef<any>;

  @ContentChild(ConversationColumnDirective, { read: TemplateRef })
  public conversationColumnTemplate: TemplateRef<any>;

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

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
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._conversationService.conversationConfig = this.config;
    this._conversationConfig = this.config;
    this.filters = [
      { name: this.account.name, type: 'account', image: this.account.image.tiny },
      { name: 'Open', type: 'open', icon: 'chat' },
      { name: 'Closed', type: 'closed', icon: 'chat_bubble' },
    ];
    this.selectedFilter = this.filters[0];

    timer(15000, 15000)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        if (this.listComponent.list.paging.page === 1) {
          this.listComponent.reload();
        }

        this.loadStats();
      });

    
    this.loadStats();
    this.listConfig = {
      status: false,
      loadMore: true,
      queryParam: false,
      rowEvents: {
        click: (event) => {
          this.conversationOpen(event.row);
        },
      },
      noResults: {
        message: 'No conversations found',
      },
      rowActions: [
        {
          click: (conversation) => {
            return this._conversationConfig.conversationSave({
              id: conversation.id,
              state: ConversationState.Closed,
            })
            .pipe(
              tap(() => this.loadStats()),
            );
          },
          show: (conversation) => {
            return conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1 && conversation.state === ConversationState.Open;
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to close this conversation?',
          },
          label: 'Close',
        },
        {
          click: (data) => {
            return this._conversationConfig.conversationDelete(data);
          },
          show: (conversation) => {
            return conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1;
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this conversation?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,   
          lastConversationItems: true,
          lastConversationItemConversationParticipants: true,
          lastConversationItemConversationParticipantsAccounts: true,
          unreads: true,
          accountConversationRoles: true,
          conversationParticipantCounts: true,
          order: 'unread,desc;activityDate,desc',
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
              this.loadStats();
            }),
            map((response) => {
              return { 
                data: response.conversations
                .map((conversation) => {
                  return {
                    ...conversation,
                  };
                }), paging: response.paging 
              };
            }),
          );
      },
    };
  }

  public ngAfterContentInit(): void {
    this._conversationService.conversationSettingTemplate = this.conversationSettingTemplate;
    this._conversationService.conversationHeadingTemplate = this.conversationHeadingTemplate;
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

  public loadStats(): void {
    const statsFilters: any = {
      account: true,
      open: true,
      closed: true,
    };

    this._conversationConfig.conversationsStats(statsFilters)
      .subscribe((data) => {
        Object.keys(data)
          .forEach((type) => {
            const filter = this.filters
              .find((filter_: ConversationFilter) => (filter_.type === type)) as ConversationFilter;

            if (filter) {
              const item = data[type];
              filter.unread = item.unread;
              filter.count = item.count;
            }
          });

        this._cdRef.markForCheck();
      });
  }

  public conversationCreate(conversation: Conversation = { id: null }): void {
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

  public conversationStart(conversation: Conversation = {}): void {
    conversation = {
      ...conversation,
      name: format(new Date()),
    };

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

  public conversationOpen(conversation: Conversation): void {
    this._dialog.open(ConversationComponent, {
      autoFocus: false,
      id: 'converstationDialog',
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
