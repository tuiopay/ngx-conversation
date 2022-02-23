import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsCountryModule } from '@firestitch/country';

import { FsDeviceBrowserComponent } from './components/device-browser/device-browser.component';
import { FsDeviceOsComponent } from './components/device-os/device-os.component';
import { FsTrustedDevicesComponent } from './components/trusted-devices/trusted-devices.component';

import { Fs2FaIconsFactory } from './helpers/icons.factory';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    MatIconModule,

    FsListModule,
    FsDateModule,
    FsCountryModule,
  ],
  exports: [
    FsDeviceBrowserComponent,
    FsDeviceOsComponent,
    FsTrustedDevicesComponent,
  ],
  declarations: [
    FsDeviceBrowserComponent,
    FsDeviceOsComponent,
    FsTrustedDevicesComponent,
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
