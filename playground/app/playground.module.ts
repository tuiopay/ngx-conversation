import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { FsApiModule } from '@firestitch/api';
import { FsConversationModule } from '@firestitch/conversation';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsFormModule } from '@firestitch/form';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsPopoverModule } from '@firestitch/popover';
import { FsStoreModule } from '@firestitch/store';
import { FsTabsModule } from '@firestitch/tabs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppComponent } from './app.component';
import {
  ConversationsComponent,
  ExamplesComponent,
} from './components';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsConversationModule,
    DragulaModule.forRoot(),
    FsExampleModule.forRoot(),
    FsFormModule.forRoot(),
    FsApiModule.forRoot(),
    FsTabsModule.forRoot(),
    FsPopoverModule,
    FsFileModule.forRoot(),
    FsMessageModule.forRoot(),
    FsGalleryModule.forRoot(),
    RouterModule.forRoot(routes),
    FsFilterModule.forRoot({
      case: 'camel',
      queryParam: true,
      chips: true,
    }),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ConversationsComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', floatLabel: 'auto' },
    },
  ]
})
export class PlaygroundModule {
}
