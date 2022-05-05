import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { FsContentWidgetComponent } from './components/content-widget';
import { FsContentWidgetsComponent } from './components/content-widgets';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,

    FsListModule,
    FsDateModule,
    FsFormModule,
    FsHtmlEditorModule,
    FsDialogModule,
  ],
  exports: [
    FsContentWidgetsComponent,
  ],
  declarations: [
    FsContentWidgetsComponent,
    FsContentWidgetComponent,
  ],
})
export class FsContentWidgetsModule {
  static forRoot(): ModuleWithProviders<FsContentWidgetsModule> {
    return {
      ngModule: FsContentWidgetsModule,
    };
  }
}
