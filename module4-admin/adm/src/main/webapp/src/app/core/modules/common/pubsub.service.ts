// API requests shall only be initated by Shell application
import { Injectable, NgZone } from '@angular/core';
import { MxAdmApiService, MxAdmConfigService } from '@tagit/mx-admin-library/api';
import { UtilityService } from './utility.service';
import { AppService } from '../../../core/modules/services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { MxErrorPopupComponent } from '../../../shared/components/mx-error-popup/mx-error-popup.component'
import { CommonConstants } from '../../../../enums/common-constants.enum';
import { MicroappService } from './microapp.service';

@Injectable({
  providedIn: 'root'
})

export class PubsubService {
  isStandAlone: boolean;
  appName: string;
  middlewareUrl: string;
  microAppconfig: string;
  merchantConfig: any;
  reqHeaders = {};
  microAppBaseUrl: string;
  sampleUserInfo = {
    detail: {
      appId: 2,
      appImage: "TesT",
      appKeyword: "QA",
      appName: "QATEST",
      contactAddress: "admin",
      contactEmail: "mxserver@tagitmobile.com",
      contactName: "Admin",
      contactPhone: "8765439870",
      country: 1,
      countryDescription: null,
      createdBy: "Thilaga",
      createdDate: "2020-10-05T13:41:41Z",
      description: "QA Test App",
      lastAction: "UPDATE",
      modifiedBy: "Gokul",
      modifiedDate: "2020-10-27T12:41:37Z",
      tenantId: null,
      version: 3,
      mode: "maker",
      username: "Deepa",
      language: 'fr'
    }
  }
  constructor(private apiService: MxAdmApiService, private configService: MxAdmConfigService, private utilityService: UtilityService, private appService: AppService,
    private dialog: MatDialog, private zone: NgZone, private microappService: MicroappService) {
    // To call the specific application.

    this.appName = CommonConstants.CUSTOM_ADMIN;
    this.configService.loadSettings().subscribe(res => {
    this.isStandAlone = this.configService.get('standAlone') || false;
    this.microAppconfig = (this.microappService.getMicroAppData().microAppInfo !== undefined) ? this.microappService.getMicroAppData().microAppInfo : [];
    if (this.isStandAlone !== true && this.microAppconfig[this.appName] !== undefined) {
      let path = this.microAppconfig[this.appName]?.path;
      let microAppBaseUrlArray = path.split('/');
      microAppBaseUrlArray.pop();
      this.microAppBaseUrl = microAppBaseUrlArray.join('/');
    } else {
      this.microAppBaseUrl = '.'
    }
    this.utilityService.microAppBaseURL = this.microAppBaseUrl;
    // Read the configuration from development.json.
    this.merchantConfig = this.configService.get('merchantConfig') || this.sampleUserInfo.detail;
    this.reqHeaders = {
      'X-App-ID': this.merchantConfig.appId || '1',
      'X-Request-By': this.merchantConfig.username || CommonConstants.MRB_ADMIN,
      'X-Request-By-Type': this.merchantConfig.mode || CommonConstants.MRB_ADMIN,
      'X-Request-ID': this.merchantConfig.username || CommonConstants.MRB_ADMIN,
      // 'X-Tenant-ID': this.merchantConfig.appKeyword || 'MX',
      'Authorization': 'Bearer ' + ''
    }
    });
  }

  publishEvent(topic, message) {
    if (this.isStandAlone) {
      if (topic === 'ce_api_request') {
        const apiUrl = 'mobeixadmin/' + message.detail.endpoint;
        if (message.detail.method.toLowerCase() == 'get') {
          this.getApiRequest(apiUrl, message);
        } else if (message.detail.method.toLowerCase() == 'post') {
          this.postApiRequest(apiUrl, message);
        } else if (message.detail.method.toLowerCase() == 'put') {
          this.putApiRequest(apiUrl, message);
        } else if (message.detail.method.toLowerCase() == 'delete') {
          this.deleteApiRequest(apiUrl, message);
        } else if (message.detail.method.toLowerCase() == 'patch') { 
          this.patchApiRequest(apiUrl, message);
        } else {
          this.getApiRequest(apiUrl, message);
        }

      }
      else if (topic === 'ce_user_info_request') {
        return message.detail.callback && message.detail.callback(this.merchantConfig)
      }
    }
    else {
      let data = message;
      data.detail = data.detail || {};
      data.detail.appName = this.appName;
      if (this.isValidAPICall(data.detail.route)) {
        const event = new CustomEvent(topic, data);
        window.dispatchEvent(event);
      }
      else {
        console.error("Route not added in the request");
      }
    }
  }


  getApiRequest(apiUrl, message) {
    this.apiService.get(apiUrl, message.detail.urlParams, {
      headers: {...this.reqHeaders, ...message.detail.options.headers},
      params: message.detail.options.params
    }).subscribe({next: res => {
      res['detail'] = res;
      message.detail.callback(res)
    },
    error: error => {
      this.onThrowErrorPopup(error);
    }
  });
}

  putApiRequest(apiUrl, message) {
    this.apiService.put(apiUrl, message.detail.data, message.detail.urlParams, {
      headers: {...this.reqHeaders, ...message.detail.options.headers},
      params: message.detail.options.params
    }).subscribe({next: res => {
      res['detail'] = res;
      message.detail.callback(res);
    },
    error: error => {
      this.onThrowErrorPopup(error);
    }
    });
  }

  patchApiRequest(apiUrl, message) {
    this.apiService.patch(apiUrl, message.detail.data, message.detail.urlParams, {
      headers: {...this.reqHeaders, ...message.detail.options.headers},
      params: message.detail.options.params
    }).subscribe({
      next: (res) => {
        res['detail'] = res;
        message.detail.callback(res);
      },
      error: (error) => {
        this.onThrowErrorPopup(error);
      }
    })
  }

  postApiRequest(apiUrl, message) {
    this.apiService.post(apiUrl, message.detail.data, message.detail.urlParams, {
      headers: {...this.reqHeaders, ...message.detail.options.headers},
      params: message.detail.options.params,
    })
    .subscribe({next: res => {
      res['detail'] = res;
      message.detail.callback(res);
    },
    error: error => {
      this.onThrowErrorPopup(error);
    }
    });
  }

  deleteApiRequest(apiUrl, message) {
    this.apiService.delete(apiUrl, message.detail.urlParams, {
      headers: {...this.reqHeaders, ...message.detail.options.headers},
      params: message.detail.options.params
    }).subscribe({next: res => {
      res['detail'] = res;
      message.detail.callback(res)
    },
    error: error => {
      this.onThrowErrorPopup(error);
    }});
  }


  showLoader(): void {
    let data = { 'detail': { show: true } };
    const event = new CustomEvent('ce_loader_request', data);
    window.dispatchEvent(event);
  }

  hideLoader(): void {
    let data = { 'detail': { show: false } };
    const event = new CustomEvent('ce_loader_request', data);
    window.dispatchEvent(event);
  }


  subscribeToEvent(topic: string, handler) {
    window.addEventListener(topic, handler);
  }
  unsubscribeFromEvent(topic: string, handler) {
    window.removeEventListener(topic, handler);
  }
  onThrowErrorPopup(error) {
    this.onErrorPopupDisplay(error);

  }

  /* To validate the current route api call*/
  isValidAPICall(route = "/"): boolean {
    const fullPath = window.location.href;
    if (fullPath.includes(route)) {
      return true;
    }
    return false;
  }


  onErrorPopupDisplay(errdata) {
    const ErrData = (errdata.detail) ? errdata.detail : errdata;
    const comp = MxErrorPopupComponent;
    const errObj = { data: { message: '', errDetails: '' } };
    errObj.data.message = ErrData.error.code;
    errObj.data.errDetails = 'errdetails';
    const errors = this.configService.get('errors');
    const dialogData = this.updateErrormessage(ErrData, errors);
    this.zone.run(() => {
    this.dialog.open(comp, { data: dialogData });
    });
  }


  updateErrormessage(err, errObj) {
    errObj = errObj || {}
    errObj.data = errObj.data || {};
    
    if (err.error.code) {
      /**
       * Custom error code handling
       */
      errObj.data.message = err.error.code;
      errObj.data.errDetails = (err.error.errorDetails && err.error.errorDetails.length > 0) ? err.error.errorDetails : [];
    } else if (err.error) {
      /**
       * IAM error code handling
       */
      errObj.data.message = err.error.error;
    } else {
      /**
       * If both not available read err object from app.module
       */
      // errObj.data.message = errObj.data.message;
    }
    return errObj.data;
  }

  userSessionExtend() {
    const moduleName = this.microappService.getMicroAppData().microAppInfo ? (this.microappService.getMicroAppData().microAppInfo[CommonConstants.CUSTOM_ADMIN]?.moduleName) : "mxadmin";
    this.publishEvent('ce_extend_session', {
      detail: {
        moduleName: moduleName,
        callback: (sessionInfo) => {
          if(sessionInfo.sessionExtended) {
            // success callback logic goes here
          }
        }
      }
    })
  }

}
