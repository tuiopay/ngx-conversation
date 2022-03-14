import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsCountryModule } from '@firestitch/country';
import { FsDeviceModule } from '@firestitch/device';
import { FsBadgeModule } from '@firestitch/badge';
import { FsIpModule } from '@firestitch/ip';

import { FsSigninsComponent } from './components/signins/signins.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,

    FsListModule,
    FsDateModule,
    FsCountryModule,
    FsDeviceModule,
    FsBadgeModule,
    FsIpModule,
  ],
  exports: [
    FsSigninsComponent,
  ],
  declarations: [
    FsSigninsComponent,
  ],
})
export class FsSigninModule {
  static forRoot(): ModuleWithProviders<FsSigninModule> {
    return {
      ngModule: FsSigninModule,
    };
  }
}
