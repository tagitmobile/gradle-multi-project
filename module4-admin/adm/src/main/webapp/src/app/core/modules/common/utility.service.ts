import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  merchantId: string;
  merchantName: string;
  tenantId: string;
  userIdVal: string;
  LastFiredAction: string;
  userTypeVal: any;
  microAppBaseUrl: string;
  appId: string;
  language: string = '';


  SetAppData(data) {
    this.merchantID = data.appId;
    this.merchantName = data.appName;
    this.tenantID = data.tenantId;
    this.userID = data.username;
    this.userType = data.mode;
    this.appId = data.appKeyword;
    this.languageCode = data.language || 'en';
  }


  SetMicroBaseUrl(url) {
    this.microAppBaseURL = url;
  }
  set languageCode(lang: string) {
    this.language = lang;
  }

  get languageCode(): string {
    return this.language;
  }
  set merchantID(merchantid: string) {
    this.merchantId = merchantid;
  }

  get merchantID(): string {
    return this.merchantId;
  }

  set userID(usrid: any) {
    this.userIdVal = usrid;
  }

  get userID(): any {
    return this.userIdVal;
  }

  set userType(usrtype: any) {
    this.userTypeVal = usrtype;
  }

  get userType(): any {
    return this.userTypeVal;
  }

  set tenantID(prgmid: string) {
    this.tenantId = prgmid;
  }

  get tenantID(): string {
    return this.tenantId;
  }

  set microAppBaseURL(baseurl: string) {
    this.microAppBaseUrl = baseurl;
  }
  get microAppBaseURL(): string {
    return this.microAppBaseUrl;
  }
}
