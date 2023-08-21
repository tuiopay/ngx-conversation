import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { FsFormModule } from '@firestitch/form';
import { FsLinkModule } from '@firestitch/link';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFileModule } from '@firestitch/file';
import { FsBadgeModule } from '@firestitch/badge';
import { FsDateModule } from '@firestitch/date';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsChipModule } from '@firestitch/chip';
import { FsTabsModule } from '@firestitch/tabs';
import { FsPopoverModule } from '@firestitch/popover';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import {
  ConversationPaneComponent, ConversationCreateComponent, ConversationParticipantComponent, ConversationParticipantsComponent,
  FsConversationsComponent, ConversationSettingsComponent, ConversationStateComponent, ParticipantsListComponent,
  ParticipantsAddComponent,
  ConversationHeaderComponent,
  ConversationItemsComponent,
  ConversationReadParticipantsPopoverComponent,
  ConversationReadParticipantsDialogComponent,
  ConversationsPaneComponent,
} from './components';
import { AutofocusDirective, ConversationColumnDirective, ConversationHeaderDirective, ConversationSettingsDirective, ScrollIntoViewDirective } from './directives';
import { FsFilterModule } from '@firestitch/filter';
import { ConversationBadgeNamePipe, ConversationNamePipe } from './pipes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    ConversationColumnDirective,
    AutofocusDirective,
    ConversationHeaderDirective,
    ConversationsPaneComponent,
    ConversationBadgeNamePipe,
    ConversationNamePipe,
  ],
  exports: [
    FsConversationsComponent,
    ConversationSettingsDirective,
    ConversationColumnDirective,
    ConversationHeaderDirective,
  ],
})
export class FsConversationModule {}
