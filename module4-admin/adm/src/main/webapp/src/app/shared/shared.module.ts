import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MxInfoPopupComponent } from './components/mx-info-popup/mx-info-popup.component';
import { MxFeedbackPopupComponent } from './components/mx-feedback-popup/mx-feedback-popup.component';
import { MXBreadcrumbComponent } from './components/mx-breadcrumb/mx-breadcrumb.component';
import { A11yModule } from '@angular/cdk/a11y';
import { MxButtonComponent } from './components/mx-button/mx-button.component';
import { MxSuccessComponent } from './components/mx-success/mx-success.component';
import { MXViewCustomerComponent } from './components/mx-view-customer/mx-view-customer.component';
import { MXViewCustomerRemarksComponent } from './components/mx-view-customer-remarks/mx-view-customer-remarks.component';
import { MxAdmTableModule } from '@tagit/mx-admin-library/mx-adm-table';
import { MxAdmSearchModule } from '@tagit/mx-admin-library/mx-adm-search';
import { NgxDaterangepickerMd } from './components/daterangepicker/daterangepicker.module';
import { TableComponent } from './components/mx-table/table.component';
import { TableEmptyMessageComponent } from './components/mx-table/table-empty-message.component';
import { PipesModule } from './pipes/pipes.module';
import { CustomValidationDirective } from './directive/custom-validation.directive';
import { MxModalComponent } from './components/mx-modal/mx-modal.component';
import { MxModalViewComponent } from './components/mx-modal-view/mx-modal-view.component';
import { MxErrorPopupComponent } from './components/mx-error-popup/mx-error-popup.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translation/', '.json');

}

@NgModule({
  declarations: [
    MxInfoPopupComponent,
    MxFeedbackPopupComponent,
    MxButtonComponent,
    MxSuccessComponent,
    MXViewCustomerComponent,
    MXViewCustomerRemarksComponent,
    TableEmptyMessageComponent,
    TableComponent,
    MXBreadcrumbComponent,
    CustomValidationDirective,
    MxModalComponent,
    MxModalViewComponent,
    MxErrorPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    MxAdmTableModule,
    TranslateModule,
    NgxDaterangepickerMd.forRoot({}),
    A11yModule,
    NgxDaterangepickerMd,
    PipesModule,
    MxAdmSearchModule
  ],
  providers: [],
  exports: [MaterialModule, FlexLayoutModule, TranslateModule, MxInfoPopupComponent, MxButtonComponent, NgxDaterangepickerMd, MXViewCustomerComponent, MXViewCustomerRemarksComponent,
    MxSuccessComponent, MxFeedbackPopupComponent, MxAdmTableModule, NgxDaterangepickerMd, A11yModule,
    MxModalComponent,
    MxModalViewComponent,
    TableEmptyMessageComponent,
    TableComponent,
    MXBreadcrumbComponent,
    PipesModule,
    CustomValidationDirective,
    MxErrorPopupComponent,
    MxAdmSearchModule]
})
export class SharedModule {

}
