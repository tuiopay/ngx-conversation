import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsCountryModule } from '@firestitch/country';
import { FsDeviceModule } from '@firestitch/device';

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
    FsDeviceModule,
  ],
  exports: [
    FsTrustedDevicesComponent,
  ],
  declarations: [
    FsTrustedDevicesComponent,
  ],
  providers: [
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
