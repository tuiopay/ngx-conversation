import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsComponentComponent } from './components/component/component.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsComponentComponent,
  ],
  declarations: [
    FsComponentComponent,
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
