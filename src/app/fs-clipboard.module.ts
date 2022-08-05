import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsClipboardComponent } from './components/clipboard/clipboard.component';
import { FsClipboardButtonComponent } from './components/clipboard-button/clipboard-button.component';
import { FsClipboardButtonDirective } from './directives/clipboard/clipboard.directive';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    FsClipboardButtonComponent,
    FsClipboardButtonDirective,
    FsClipboardComponent,
  ],
  exports: [
    FsClipboardButtonDirective,
    FsClipboardButtonComponent,
    FsClipboardComponent,
  ],
})
export class FsClipboardModule {
  static forRoot(): ModuleWithProviders<FsClipboardModule> {
    return {
      ngModule: FsClipboardModule,
    };
  }
}
