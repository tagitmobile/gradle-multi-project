import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[mxAcInputType]',
    standalone: false
})

// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class CustomValidationDirective implements OnInit {

  @Input() appInputType: string;
  @Input() appDecimalLength: number;
  @Input() appInputLength: number;
  @Input() appPeriodicVal: string;
  @Input() appInputMaxVal: string;

  regex: RegExp;
  maxValue: number;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'Shift', 'Control', 'Enter'];
  private dotKeyCodes: Array<number> = [46, 110, 190];

  constructor(private el: ElementRef) {
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    if (this.appInputType !== '') {
      if (this.appInputType === 'numberWithDecimal') {
        this.regex = /^\d{0,15}(\.\d{0,2})?$/
      } else if (this.appInputType === 'onlyNumber') {
        this.regex = new RegExp(/^[1-9]\d*$/g);
      } else if (this.appInputType === 'alphaNumeric') {
        this.regex = new RegExp(/^[a-zA-Z0-9 ]*$/g);
      } else if (this.appInputType === 'alphaNumericWS') {
        this.regex = new RegExp(/^[a-zA-Z0-9]*$/g);
      } else if (this.appInputType === 'alphaNumericWith_') {
        this.regex = new RegExp(/^[a-zA-Z0-9_]*$/g);
      } else if (this.appInputType === 'onlyCharacter') {
        this.regex = new RegExp(/^[a-zA-Z]*$/g);
      } else if (this.appInputType === 'alphawithSpace') {
        this.regex = new RegExp(/^[a-zA-Z ]*$/g);
      } else if (this.appInputType === 'onlyLowercase') {
        this.regex = new RegExp(/^[a-z]*$/g);
      } else if (this.appInputType === 'onlyUppercase') {
        this.regex = new RegExp(/^[A-Z]*$/g);
      } else if (this.appInputType === 'alphaNumericWithSpecial') {
        this.regex = new RegExp(/^[!@#$%^*&/.+\w\s]*$/g);
      } else if (this.appInputType === 'commissionWithDecimal') {
        this.regex = new RegExp(/^(\d{0,2})+(\.\d{0,2}){0,1}$/g);
      } else if (this.appInputType === 'alphaNumericWithSpecialWithoutSpace') {
        this.regex = new RegExp(/^[@#$%^&/.+\w]*$/g);
      } else if (this.appInputType === 'maxValue') {
        this.regex = new RegExp(/^\d*\.?\d{0,2}$/g);
        if (this.appInputMaxVal !== '') {
          this.maxValue = Number(this.appInputMaxVal);
        }
      }
    } else {
      this.regex = new RegExp(/^[a-zA-Z0-9]*$/g);
    }
    if (this.appInputMaxVal !== '') {
      this.maxValue = Number(this.appInputMaxVal);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, tab, end,delete, left and right arrow keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    const current: string = this.el.nativeElement.value;

    // We need this because the current value on the DOM element
    // is not yet updated with the value from this event
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    } else {
      let formControl;
      formControl = event.target;
      if (this.appInputType === 'numberWithDecimal') {
        formControl.value = formControl.value.replace(/[^0-9.]+/g, '');
      } else if (this.appInputType === 'onlyNumber') {
        formControl.value = formControl.value.replace(/\D*/g, '');
      }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    const current: string = this.el.nativeElement.value;
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let formControl;
    formControl = event.target;
    if (this.appInputType === 'numberWithDecimal') {
      formControl.value = formControl.value.replace(/[^0-9.]+/g, '');
    } else if (this.appInputType === 'onlyNumber') {
      formControl.value = formControl.value.replace(/[^0-9]*/g, '');
    }

    if (this.appInputMaxVal !== '' && Number(current) > this.maxValue) {
      this.el.nativeElement.value = '';
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    if (this.appInputType === 'onlyNumber') {
      this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
      if ( initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }
}


