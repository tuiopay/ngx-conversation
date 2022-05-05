import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsContentWidgetsModule, FsContentWidgetModule } from '@firestitch/content-widget';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { ContentWidgetsComponent } from './components/content-widgets';
import { FS_CONTENT_WIDGET_CONFIG } from 'src/app/content-widget/injectors';
import { contentWidgetConfigFactory } from './helpers/content-widget-config-factory';
import { ContentWidgetComponent } from './components/content-widget';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsContentWidgetsModule,
    FsContentWidgetModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsExampleModule.forRoot(),
    FsHtmlEditorModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: FS_CONTENT_WIDGET_CONFIG, 
      useFactory: contentWidgetConfigFactory, 
      deps: [ ] 
    },
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ContentWidgetsComponent,
    ContentWidgetComponent,
  ],
})
export class PlaygroundModule {
}
