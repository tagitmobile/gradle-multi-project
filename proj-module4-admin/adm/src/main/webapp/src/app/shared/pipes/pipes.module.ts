import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from './custom-currency.pipe';
import { CustomDatePipe } from './custom-date.pipe';


@NgModule({
  declarations: [CustomCurrencyPipe, CustomDatePipe],
  imports: [
    CommonModule
  ],
  exports: [CustomCurrencyPipe, CustomDatePipe],
  providers: [CustomCurrencyPipe, CustomDatePipe]
})
export class PipesModule { }
