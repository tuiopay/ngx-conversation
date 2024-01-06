import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsBadgeModule } from '@firestitch/badge';
import { FsChipModule } from '@firestitch/chip';
import { FsCommonModule } from '@firestitch/common';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsFormModule } from '@firestitch/form';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsLinkModule } from '@firestitch/link';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsPopoverModule } from '@firestitch/popover';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTabsModule } from '@firestitch/tabs';

import {
  ConversationCreateComponent,
  ConversationHeaderComponent,
  ConversationItemsComponent,
  ConversationPaneComponent,
  ConversationParticipantComponent, ConversationParticipantsComponent,
  ConversationReadParticipantsDialogComponent,
  ConversationReadParticipantsPopoverComponent,
  ConversationSettingsComponent, ConversationStateComponent,
  ConversationsPaneComponent,
  FsConversationsComponent,
  ParticipantsAddComponent,
  ParticipantsListComponent,
} from './components';
import {
  ConversationHeaderDirective, ConversationSettingsDirective,
  ConversationsConversationDirective, ConversationsConversationNameDirective, ScrollIntoViewDirective,
} from './directives';
import { ConversationBadgeNamePipe, ConversationNamePipe } from './pipes';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,

    FsFormModule,
    FsCommonModule,
    FsDialogModule,
    FsDateModule,
    FsListModule,
    FsFileModule,
    FsLinkModule,
    FsFilterModule,
    FsMenuModule,
    FsGalleryModule,
    FsChipModule,
    FsLabelModule,
    FsSkeletonModule,
    FsBadgeModule,
    FsTabsModule,
    FsHtmlRendererModule,
    FsPopoverModule,
    FsAutocompleteChipsModule,
  ],
  declarations: [
    ConversationPaneComponent,
    FsConversationsComponent,
    ConversationCreateComponent,
    ConversationStateComponent,
    ConversationSettingsComponent,
    ConversationParticipantComponent,
    ConversationParticipantsComponent,
    ParticipantsListComponent,
    ConversationStateComponent,
    ParticipantsAddComponent,
    ScrollIntoViewDirective,
    ConversationHeaderComponent,
    ConversationItemsComponent,
    ConversationSettingsDirective,
    ConversationReadParticipantsPopoverComponent,
    ConversationReadParticipantsDialogComponent,
    ConversationsConversationNameDirective,
    ConversationsConversationDirective,
    ConversationHeaderDirective,
    ConversationsPaneComponent,
    ConversationBadgeNamePipe,
    ConversationNamePipe,
  ],
  exports: [
    FsConversationsComponent,
    ConversationSettingsDirective,
    ConversationsConversationDirective,
    ConversationHeaderDirective,
    ConversationsConversationNameDirective,
  ],
})
export class FsConversationModule { }
