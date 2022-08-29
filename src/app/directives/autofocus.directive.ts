import { Directive, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements OnInit {

  constructor(
    private _el: ElementRef,
  ) {}

  public ngOnInit(): void {
    this._el.nativeElement.focus();
  }
}
