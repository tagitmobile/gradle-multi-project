import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()

export class MicroappService {
  handlers = {};
  private config: any;
  private appInfo: any;
  private loadedApp: string[];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  init(): void {
    this.loadedApp = [];
  }

  setMicroAppData (mircoAppData) {
    this.config = mircoAppData?.microAppConfig || {};
    this.appInfo = mircoAppData?.microAppInfo || {};
  }

  getMicroAppData() {
    return { microAppConfig: this.config , microAppInfo: this.appInfo };
  }

  getMicroAppBaseUrlForApp(appName): string {
    if(this.appInfo &&  this.appInfo[appName]) {
      let path = this.appInfo[appName]?.path;
      let microAppBaseUrlArray = path.split('/');
      microAppBaseUrlArray.pop();
      return microAppBaseUrlArray.join('/');
    }
    return '.';
  }

  getLanguageurlforapp(appName): string {
    if(this.appInfo[appName]) return this.appInfo[appName].languageURL;
    return '.';
  }

  renderAppByRoute(route) {
    if(route && route['micro-app']) {
      this.loadCustomAdmin(this.config[route['micro-app']][0], this.appInfo, route['app-route']).then(res =>{
      }).catch(err => {
      });
    }
  }

  appLoaded(appName) {
    if(this.loadedApp.indexOf(appName) > -1) {
      return true;
    }
    return false;
  }

  public loadCustomAdmin(app, appInfo, route): Promise<any> {
    window.location.reload();
    const promise = new Promise<any>((resolve, reject) => {
      const content = document.getElementById(app.containerId);
      if(this.appLoaded(app.appName)) {
        resolve({ app: {  name: app.appName, status: 'loaded' } });
      }
      else {
        const script = document.createElement('script');
        script.src = appInfo[app.appName]?.path
        this.loadedApp.push(app.appName);
        script.onload = () => {
          console.log(app.appName + ' loaded');
          resolve({ app: {  name: app.appName, status: 'loaded' } });
        };
        script.onerror = () => {
          console.error('error');
          resolve({ app: {  name: app.appName, status: 'failed' } });
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      }
      const element: HTMLElement = document.createElement(appInfo[app.appName].element);
      if(app.attributes) {
        app.attributes.forEach(attribute => {
          element.setAttribute(attribute.name, attribute.value)
        });
      }
      if(route) {
        element.setAttribute("route", route);
      }
      content.appendChild(element);
    });
    return promise;
  }
}
