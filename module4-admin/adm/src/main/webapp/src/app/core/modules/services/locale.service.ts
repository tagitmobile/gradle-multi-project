import { Injectable } from '@angular/core';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe'
@Injectable()
export class LocaleService {
  constructor(private formatCurrency: CustomCurrencyPipe, private configService: MxAdmConfigService) { }
  getLocale(currency) {
    let locale = 'en';
    const langCulture = this.configService.get('langCultureJson');
    if (langCulture) {
      for (const item of langCulture) {
        if (item.Code === currency) {
          locale = item.Culture;
          break;
        }
      }
    } else {
      let langCul = [
        { "Code": "BND", "Culture": "en" },
        { "Code": "LAK", "Culture": "en-IN" },
        { "Code": "SGD", "Culture": "en-SG" },
        { "Code": "USD", "Culture": "en" },
        { "Code": "INR", "Culture": "en-IN" },
        { "Code": "PHP", "Culture": "en-PH" },
        { "Code": "HKD", "Culture": "en-HK" }
      ];
      for (const item of langCul) {
        if (item.Code === currency) {
          locale = item.Culture;
          break;
        }
      }
    }
    return locale;
  }
  getformatCurrency(value, code, symbol) {
    let curr = '';
    curr = this.formatCurrency.transform(value, '', '', '', this.getLocale(code));
    return curr;
  }
}​​​​​