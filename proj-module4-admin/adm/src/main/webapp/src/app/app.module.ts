import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { AppService } from './core/modules/services/app.service';
import { ViewService } from './core/modules/services/view.service';
import { LocaleService } from './core/modules/services/locale.service';
import { createCustomElement } from '@angular/elements';
import { ApiInterceptorService } from './core/modules/services/api.interceptor';

import { MxAdmApiModule } from '@tagit/mx-admin-library/api';
import { MxAdmPipesModule } from '@tagit/mx-admin-library/pipes';
import { MxAdmTableModule } from '@tagit/mx-admin-library/mx-adm-table';
import { MxAdmAdvanceSearchModule } from '@tagit/mx-admin-library/mx-adm-advance-search';
import { MxAdmSearchModule } from '@tagit/mx-admin-library/mx-adm-search';
import { MxAdmDirectivesModule } from '@tagit/mx-admin-library/directives';
import { MxAdmCrudModule } from '@tagit/mx-admin-library/mx-adm-crud';

import { MicroappService } from './core/modules/common/microapp.service';
import { AppMessagesTableComponent } from './core/modules/messages/app-messages/app-messages-table/app-messages-table.component';
import { BpmnComponent } from './bpmn/bpmn.component';
import {DragDropModule} from '@angular/cdk/drag-drop';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translation/', '.json');
}
const errors = [
  {
    code: 400,
    data: { message: 'serverErrMsg.SERVERERROR400', heading: 'Server Error', popupType: 'Info', errorDetails: [] },
    excludeErrors: ['USER_ALREADY_EXISTS'],
    messages: [
      {
        key: 'Invalid refresh token',
        data: {
          message: 'serverErrMsg.SERVERERROR400', heading: 'Server Error', popupType: 'Info', popupAction: 'logout',
          errorDetails: []
        },
      }
    ]
  }
  ,
  { code: 401, data: { message: 'serverErrMsg.SERVERERROR401', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 403, data: { message: 'serverErrMsg.SERVERERROR403', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  {
    code: 404, data: {
      message: 'serverErrMsg.SERVERERROR404', heading: 'Server Error', popupType: 'Info', errorDetails: []
    }
  },
  { code: 405, data: { message: 'serverErrMsg.SERVERERROR405', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 406, data: { message: 'serverErrMsg.SERVERERROR406', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 408, data: { message: 'serverErrMsg.SERVERERROR408', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 409, data: { message: 'serverErrMsg.SERVERERROR409', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 415, data: { message: 'serverErrMsg.SERVERERROR415', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 422, data: { message: 'serverErrMsg.SERVERERROR422', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 500, data: { message: 'serverErrMsg.SERVERERROR500', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
  { code: 503, data: { message: 'serverErrMsg.SERVERERROR503', heading: 'Server Error', popupType: 'Info', errorDetails: [] } },
];
@NgModule({
  declarations: [
    AppComponent,
    AppMessagesTableComponent,
    BpmnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MxAdmAdvanceSearchModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    MxAdmApiModule.forRoot(),
    MxAdmAdvanceSearchModule,
    MxAdmPipesModule,
    MxAdmTableModule,
    MxAdmSearchModule,
    MxAdmCrudModule,
    DragDropModule,
    MxAdmDirectivesModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    MicroappService,
    AppService,
    ViewService,
    LocaleService,
    DatePipe,
    provideHttpClient(withInterceptorsFromDi())
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: []
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector,
              ) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.get('mx-ac-custom-admin12-root') || customElements.define('mx-ac-custom-admin12-root', el);
  }
}
