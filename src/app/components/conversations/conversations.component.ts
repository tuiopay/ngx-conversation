import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { ConversationHeaderDirective, ConversationSettingsDirective, ConversationsConversationDirective, ConversationsConversationNameDirective } from '../../directives';
import { ConversationService } from '../../services';
import { Account, Conversation, ConversationConfig } from '../../types';
import { ConversationPaneComponent } from '../conversation-pane';
import { ConversationsPaneComponent } from '../conversations-pane';


@Component({
  selector: 'fs-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversationService],
})
export class FsConversationsComponent implements OnInit, OnDestroy, AfterContentInit, OnInit {

  @ContentChild(ConversationHeaderDirective, { read: TemplateRef })
  public conversationHeadingTemplate: TemplateRef<any>;

  @ContentChild(ConversationSettingsDirective, { read: TemplateRef })
  public conversationSettingTemplate: TemplateRef<any>;

  @ContentChild(ConversationsConversationDirective, { read: TemplateRef })
  public conversationsConversationTemplate: TemplateRef<any>;

  @ContentChild(ConversationsConversationNameDirective, { read: TemplateRef })
  public conversationsConversationNameTemplate: TemplateRef<any>;

  @ViewChild(ConversationPaneComponent)
  public conversationPane: ConversationPaneComponent;

  @ViewChild(ConversationsPaneComponent)
  public conversationsPane: ConversationsPaneComponent;

  @Input() public config: ConversationConfig;
  @Input() public account: Account;

  @Output() public conversationOpened = new EventEmitter();

  public conversation: Conversation;

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
      this.conversationsPane.scrollTop();
    }
  }

  public conversationClose(reload = false): void {
    this.conversation = null;
    this.conversationsPane.deselect();

    if (reload) {
      this.conversationsPane.reload();
    }
  }

  public conversationStarted(conversation: Conversation): void {
    this._conversationOpen(conversation)
      .pipe(
        take(1),
        switchMap(() => {
          return this.conversationOpened.asObservable()
            .pipe(
              take(1),
            );
        }),
        switchMap(() => this.conversationService.startConversation.afterOpen(conversation)),
      )
      .subscribe();
  }

  public conversationOpen(conversation: Conversation): void {
    // if (!conversation) {
    //   this.conversation = conversation;
    //   this.conversationsPane.reload();
    //   this._cdRef.markForCheck();

    //   return;
    // }

    if(this.conversation?.id !== conversation.id) {
      this._conversationOpen(conversation)
        .subscribe();
    }
  }

  private _conversationOpen(conversation: Conversation): Observable<any> {
    return this.conversationService.openConversation.beforeOpen(conversation)
      .pipe(
        tap(() => {
          this.conversation = conversation;
          this._cdRef.markForCheck();
        }),
      );
  }

}
