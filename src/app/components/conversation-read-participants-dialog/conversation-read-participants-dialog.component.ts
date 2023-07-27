import {
  Component, OnInit,
  ChangeDetectionStrategy, Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map } from 'rxjs/operators';

import { Account, Conversation, ConversationItem } from '../../types';
import { ConversationService } from '../../services';
import { FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';


@Component({
  templateUrl: './conversation-read-participants-dialog.component.html',
  styleUrls: ['./conversation-read-participants-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationReadParticipantsDialogComponent implements OnInit {

  public listConfig: FsListConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversation: Conversation,
      conversationItem: ConversationItem,
      conversationService: ConversationService,
      account: Account,
    },
  ) { }

  public get conversationService(): ConversationService {
    return this._data.conversationService;
  }

  public ngOnInit(): void {
    this.listConfig = {
      paging: {
        limit: 10,
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        }
      ],
      status: true,
      fetch: (query) => {
        const conversationItem = this._data.conversationItem;
        const conversation = this._data.conversation;

        query = {
          ...query,
          limit: 10,
          maxReadConversationItemId: conversationItem.id,
          notConversationParticipantId: conversationItem.conversationParticipantId,
          accounts: true,
        }

        return this._data.conversationService.conversationConfig.conversationParticipantsGet(conversation, query)
          .pipe(
            map((response) => ({ data: response.conversationParticipants, paging: response.paging })),
          );
      },
    };
  }
}
