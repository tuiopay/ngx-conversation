import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { FsDeviceBrowserComponent } from './components/device-browser/device-browser.component';
import { FsDeviceOsComponent } from './components/device-os/device-os.component';

import { Fs2FaIconsFactory } from './helpers/icons.factory';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    FsDeviceBrowserComponent,
    FsDeviceOsComponent,
  ],
  declarations: [
    FsDeviceBrowserComponent,
    FsDeviceOsComponent,
  ],
  providers: [
    // FsComponentService,
    {
      provide: APP_INITIALIZER,
      useFactory: function (iconFactory: Fs2FaIconsFactory) {
        return () => iconFactory.init();
      },
      multi: true,
      deps: [ Fs2FaIconsFactory ]
    },
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
