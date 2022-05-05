import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { FsContentWidgetComponent } from './components/content-widget';


@NgModule({
  imports: [
    CommonModule,

    FsHtmlEditorModule,
  ],
  exports: [
    FsContentWidgetComponent,
  ],
  declarations: [
    FsContentWidgetComponent,
  ],
})
export class FsContentWidgetModule {
  static forRoot(): ModuleWithProviders<FsContentWidgetModule> {
    return {
      ngModule: FsContentWidgetModule,
    };
  }
}
