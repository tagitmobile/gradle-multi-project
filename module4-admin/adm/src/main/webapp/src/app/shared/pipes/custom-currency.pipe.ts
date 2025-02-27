import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'mxCustomCurrency',
    standalone: false
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: any, currencyCode: string = 'en', display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo?: string, locale?: string): string | null {
    let formattedValue = '';
    const currencyPipe: CurrencyPipe = new CurrencyPipe(currencyCode);
    formattedValue = currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
    return formattedValue;
  }

}
