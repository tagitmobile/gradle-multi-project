import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Injector, NgModule, NgZone } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { AppService } from './core/modules/services/app.service';
import { ViewService } from './core/modules/services/view.service';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeIN from '@angular/common/locales/en-IN';
import localeSG from '@angular/common/locales/en-SG';
import { MxAdmPipesModule } from '@tagit/mx-admin-library/pipes';
import { MxAdmAdvanceSearchModule } from '@tagit/mx-admin-library/mx-adm-advance-search';
import { MxAdmTableModule } from '@tagit/mx-admin-library/mx-adm-table';
import { MxAdmApiModule } from '@tagit/mx-admin-library/api';
import { MxAdmSearchModule } from '@tagit/mx-admin-library/mx-adm-search';
import { MxAdmCrudModule } from '@tagit/mx-admin-library/mx-adm-crud';
import { MicroappService } from './core/modules/common/microapp.service';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';

registerLocaleData(localeIN);
registerLocaleData(localeSG);


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translation/', '.json');
}

const servErr = 'Server Error';
const errors = [
  {
    code: 400,
    data: { message: 'SERVR_ERRMSG.SERVR_ERR400', heading: servErr, popupType: 'Info', errorDetails: [] },
    excludeErrors: ['USER_ALREADY_EXISTS'],
    messages: [
      {
        key: 'Invalid refresh token',
        data: {
          message: 'SERVR_ERRMSG.ServerError400', heading: servErr, popupType: 'Info', popupAction: 'logout',
          errorDetails: []
        },
      }
    ]
  }
  ,
  { code: 401, data: { message: 'SERVR_ERRMSG.SERVR_ERR401', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 403, data: { message: 'SERVR_ERRMSG.SERVR_ERR403', heading: servErr, popupType: 'Info', errorDetails: [] } },
  {
    code: 404, data: {
      message: 'SERVR_ERRMSG.SERVR_ERR404', heading: servErr, popupType: 'Info', errorDetails: []
    }
  },
  { code: 405, data: { message: 'SERVR_ERRMSG.SERVR_ERR405', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 406, data: { message: 'SERVR_ERRMSG.SERVR_ERR406', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 408, data: { message: 'SERVR_ERRMSG.SERVR_ERR408', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 409, data: { message: 'SERVR_ERRMSG.SERVR_ERR409', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 415, data: { message: 'SERVR_ERRMSG.SERVR_ERR415', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 422, data: { message: 'SERVR_ERRMSG.SERVR_ERR422', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 500, data: { message: 'SERVR_ERRMSG.SERVR_ERR500', heading: servErr, popupType: 'Info', errorDetails: [] } },
  { code: 503, data: { message: 'SERVR_ERRMSG.SERVR_ERR503', heading: servErr, popupType: 'Info', errorDetails: [] } },
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MxAdmPipesModule,
    MxAdmAdvanceSearchModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MxAdmPipesModule,
    TranslateModule.forRoot(),
    MxAdmApiModule.forRoot(),
    MxAdmTableModule,
    MxAdmSearchModule,
    MxAdmAdvanceSearchModule,
    MxAdmCrudModule,
    MxAdmApiModule
  ],
  providers: [
    MicroappService,
    AppService,
    ViewService,
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  constructor(private readonly injector: Injector, private readonly translate: TranslateService, private readonly ngZone: NgZone,
    private readonly configService: MxAdmConfigService, private readonly microAppService: MicroappService) {
    // this.configService.load().subscribe(() => {
    //   this.microAppService.init();
    // });
  }


  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.get('app-limit-management-root') || customElements.define('app-limit-management-root', el);
  }

}
