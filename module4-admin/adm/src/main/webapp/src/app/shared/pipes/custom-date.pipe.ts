import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'mxDate',
    standalone: false
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any, format?: any, timezone?: string, locale: string = 'en'): any {
    const datePipe: DatePipe = new DatePipe(locale);
    return datePipe.transform(value, format, timezone);
  }

}
