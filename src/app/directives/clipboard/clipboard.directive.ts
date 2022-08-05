import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { FsClipboard } from '../../services/clipboard-service';


@Directive({
  selector: '[fs-clipboard],[fsClipboard]',
})
export class FsClipboardButtonDirective {

  @HostListener('click')
  public clicked() {
    this.copy();
  }

  @Input() public content: 'string' | (() => string) | HTMLElement;

  public constructor(
    private _clipboard: FsClipboard,
    private _elRef: ElementRef,
  ) {}

  public copy(): void {
    if(this.content === undefined) {
      this.content = this._elRef.nativeElement;
    }

    let content = '';
    if(this.content instanceof Function) {
      content = this.content();
    } else if(this.content instanceof HTMLElement) {
      content = this.content.innerText;
    } else if(this.content) {
       content = this.content;
    }

    this._clipboard.copy(content);
  }
}
