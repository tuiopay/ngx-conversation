import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


@Injectable({ providedIn: 'root' })
export class Fs2FaIconsFactory {
  public icons = [];

  constructor(
    private _matIconRegistory: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
  ) { }

  public init() {
    this._setConfigIcons();
    this._registration();
  }

  private _setConfigIcons() {
    this.icons = [
      {
        name: 'os_androind',
        path: '/assets/@firestitch/2fa/icons/os-android.svg'
      },
      {
        name: 'os_ios',
        path: '/assets/@firestitch/2fa/icons/os-ios.svg'
      },
      {
        name: 'os_linux',
        path: '/assets/@firestitch/2fa/icons/os-linux.svg'
      },
      {
        name: 'os_win',
        path: '/assets/@firestitch/2fa/icons/os-win.svg'
      },
    ]
  }

  private _registration() {
    this.icons.forEach((icon) => {
      this._matIconRegistory.addSvgIcon(
        icon.name,
        this._domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    })
  }
}
