import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsFileModule } from '@firestitch/file';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsConversationModule } from '@firestitch/conversation';
import { FsApiModule } from '@firestitch/api';
import { FsFormModule } from '@firestitch/form';
import { FsTabsModule } from '@firestitch/tabs';

import { ToastrModule } from 'ngx-toastr';
import { DragulaModule } from 'ng2-dragula';

import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { ConversationsComponent } from './components';
import { FsPopoverModule } from '@firestitch/popover';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
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
    FsPopoverModule.forRoot(),
    FsFileModule.forRoot(),
    FsMessageModule.forRoot(),
    FsGalleryModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ConversationsComponent,
  ],
})
export class PlaygroundModule {
}
