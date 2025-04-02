import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'mx-ac-button',
    templateUrl: './mx-button.component.html',
    styleUrls: ['./mx-button.component.scss'],
    standalone: false
})
export class MxButtonComponent {
  @Input() label;
  @Input() class;
  @Input() disable = false;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() btnClick = new EventEmitter();

  constructor() { }

  // To get the Label & the class of the button and emit them
  getMxButton() {
    const btndata = { label: this.label, class: this.class };
    this.btnClick.emit(btndata);
  }

  onClose() {
  }
}
