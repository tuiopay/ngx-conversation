import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsDeviceBrowserComponent } from './components/device-browser/device-browser.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsDeviceBrowserComponent,
  ],
  declarations: [
    FsDeviceBrowserComponent,
  ],
  providers: [
    // FsComponentService,
  ],
})
export class Fs2FaModule {
  static forRoot(): ModuleWithProviders<Fs2FaModule> {
    return {
      ngModule: Fs2FaModule,
      // providers: [FsComponentService]
    };
  }
}
