import {
  Component, OnInit, 
  ChangeDetectionStrategy, Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map } from 'rxjs/operators';

import { Account, ConversationItem } from '../../types';
import { ConversationService } from '../../services';
import { FsListConfig } from '@firestitch/list';


@Component({
  templateUrl: './conversation-read-participants-dialog.component.html',
  styleUrls: ['./conversation-read-participants-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationReadParticipantsDialogComponent implements OnInit {

  public listConfig: FsListConfig;
  private _conversationService: ConversationService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationItem: ConversationItem,
      conversationService: ConversationService,
      account: Account,
    },
  ) { }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public ngOnInit(): void {    
    this.listConfig = {
      fetch: (query) => {
        const conversationItem = this._data.conversationItem;
        query = {
          ...query,
          maxReadConversationItemId: conversationItem.id,
          notConversationParticipantId: conversationItem.conversationParticipantId,
          accounts: true,
        }

        return this._data.conversationService.conversationConfig.conversationParticipantsGet(conversationItem.conversationId, query)
          .pipe(
            map((response) => ({ data: response.conversationParticipants, paging: response.paging })),
          );
      },
    };
  }
}
