import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsClipboardButtonComponent } from './components/clipboard-button/clipboard-button.component';
import { FsClipboardButtonDirective } from './directives/clipboard/clipboard.directive';
import { FsClipboardComponent } from './components/clipboard/clipboard.component';


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
}
