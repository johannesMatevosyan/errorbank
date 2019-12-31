import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';


@Directive({ selector: '[appClickOutside]' })

export class ClickOutsideDirective {
  constructor(private elRef: ElementRef) {
  }

  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elRef.nativeElement.contains(targetElement);

    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }
}
