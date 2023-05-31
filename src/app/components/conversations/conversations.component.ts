import {
  Component, OnInit, 
  ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef, TemplateRef, ContentChild, AfterContentInit, ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';

import { Account, Conversation, ConversationConfig } from '../../types';
import { ConversationService } from '../../services';
import { ConversationColumnDirective, ConversationHeaderDirective, ConversationSettingsDirective } from '../../directives';
import { ConversationComponent } from '../conversation/conversation.component';
import { ConversationsPaneComponent } from '../conversations-pane';


@Component({
  selector: 'fs-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversationService],
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterContentInit, OnInit {

  @ContentChild(ConversationHeaderDirective, { read: TemplateRef })
  public conversationHeadingTemplate: TemplateRef<any>;

  @ContentChild(ConversationSettingsDirective, { read: TemplateRef })
  public conversationSettingTemplate: TemplateRef<any>;

  @ContentChild(ConversationColumnDirective, { read: TemplateRef })
  public conversationColumnTemplate: TemplateRef<any>;

  @ViewChild(ConversationsPaneComponent)
  public conversationsPane: ConversationsPaneComponent;

  public conversation: Conversation;

  @Input() public config: ConversationConfig;
  @Input() public account: Account;

  private _destroy$ = new Subject<void>();

  constructor(
    private _conversationService: ConversationService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public get conversationConfig(): ConversationConfig {
    return this._conversationService.conversationConfig;
  }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public ngOnInit(): void {
    this._conversationService.conversationConfig = this.config;
    
    this.conversationService.initStartConversation()
      .subscribe(() => this._cdRef.markForCheck());
  }

  public ngAfterContentInit(): void {
    this._conversationService.conversationSettingTemplate = this.conversationSettingTemplate;
    this._conversationService.conversationHeadingTemplate = this.conversationHeadingTemplate;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public conversationChange(): void {
    if(this.conversationsPane) {
      this.conversationsPane.loadStats();
      this.conversationsPane.reload();
    }
  }

  public conversationOpen(conversation: Conversation): void {
    if(this.conversation?.id !== conversation.id) {
      this.conversation = null;
      this._cdRef.markForCheck();
      setTimeout(() => {
        this.conversation = conversation;
        this._cdRef.markForCheck();
      });
    }
  }

}
