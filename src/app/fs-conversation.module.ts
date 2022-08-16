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
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import { 
  ConversationComponent, ConversationCreateComponent, ConversationParticipantComponent, ConversationParticipantsComponent, 
  ConversationsComponent, ConversationSettingsComponent, ConversationStateComponent, ParticipantsListComponent, 
  ParticipantsAddComponent, 
  ConversationHeaderComponent,
  ConversationItemsComponent,
  ConversationReadParticipantsPopoverComponent,
  ConversationReadParticipantsDialogComponent
} from './components';
import { ConversationColumnDirective, ConversationSettingsDirective, ScrollIntoViewDirective } from './directives';


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

    FsFormModule,
    FsDialogModule,
    FsDateModule,
    FsListModule,
    FsFileModule,
    FsMenuModule,
    FsGalleryModule,
    FsChipModule,
    FsLabelModule,
    FsSkeletonModule,
    FsBadgeModule,
    FsTabsModule,
    FsPopoverModule,
    FsAutocompleteChipsModule,
  ],
  declarations: [
    ConversationComponent,
    ConversationsComponent,
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
  ],
  exports: [
    ConversationsComponent,
    ConversationSettingsDirective,
    ConversationColumnDirective,
  ],
})
export class FsConversationModule {}
