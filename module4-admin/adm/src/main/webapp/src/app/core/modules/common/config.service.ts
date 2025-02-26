import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { zip, Subject, firstValueFrom } from 'rxjs';

import { MxApiModule } from './@models/api-module.model';

@Injectable({
  providedIn: 'root'
})
export class MxConfigService {
  private env: {};
  private config: {};
  apiConfig: {};
  private configLoaded$ = new Subject<object>();

  constructor(private _http: HttpClient) { }

  load() {
    return firstValueFrom(
      this._http.get('config/env.json').pipe(
        switchMap((envData) => {
          this.env = envData;
          return zip(
            this._http.get(`config/${envData['env']}.json`),
            this._http.get('config/api-config.json'),
          );
        })
      )
    )
        .then(([config, apiConfig]) => {
          this.config = config;
          // eslint-disable-next-line @typescript-eslint/dot-notation
          this.config['apiConfig'] = apiConfig;
          this.setConfigData(this.config);
        })
        .catch((err) => {
          return Promise.reject(err);
        });

  }

  /**
   * Returns environment variable based on given key
   */
  getEnv(key: any) {
    return this.env[key];
  }

  setEnv(data: any) {
    this.env = data;
  }

  /**
   * Returns configuration value based on given key
   */
  get(key: any) {
    return this.config[key];
  }

  set(configData) {
    this.config = configData;
  }

  /**
   * Based on the module name value returning the module data
   * @param // module name
   */
  getModule(name) {
    const modules = this.get('apiConfig').modules as any[];
    if (modules && modules.length) {
      const module = modules.find(m => m.name === name);
      if (module) {
        return new MxApiModule(module.name, module.url, module.urls, this.get('app').baseUrl,
        this.get('app').appKey);
      } else {
        return new MxApiModule('', '', [], '', '');
      }
    }
    return new MxApiModule('', '', [], '', '');
  }


  /**
   * @summary loader function
   * @param configData config data
   */
  private setConfigData(configData) {
    this.configLoaded$.next(configData);
  }

  // loader observable
  getConfigData() {
    return this.configLoaded$.asObservable();
  }


}
