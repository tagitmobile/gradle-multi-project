import {
  Component, OnInit, ElementRef, SecurityContext, NgZone, ChangeDetectorRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PubsubService } from './core/modules/common/pubsub.service';
import { UtilityService } from './core/modules/common/utility.service';
import { MicroappService } from './core/modules/common/microapp.service';
import { CommonConstants } from '../enums/common-constants.enum';
import { MxAdmConfigService, MxAdmHeaderStickyService } from '@tagit/mx-admin-library/api';

@Component({
    selector: 'mx-ac-custom-admin12-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = CommonConstants.CUSTOM_ADMIN;
  route: string;
  constructor(private router: Router, private elementRef: ElementRef, private sanitizer: DomSanitizer,
    private pubsubService: PubsubService, private utilityService: UtilityService, private ngZone: NgZone,
    private translateService: TranslateService, private microappService: MicroappService,
    private _configService: MxAdmConfigService,
    private cdr: ChangeDetectorRef, private _stickyService: MxAdmHeaderStickyService) {
    window.addEventListener('ce_lang_change', this.subscribeToLangChange.bind(this), true);
    window.addEventListener('ce_ps_scroll',  this.subscribeToPsScroll.bind(this), true);
    this.getMicroAppInfo();
   
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.cdr.detectChanges();
      }
    });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  reloadCurrentRoute(url: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  getMicroAppInfo() {
    this.pubsubService.publishEvent('ce_microapp_info_request', {
      detail: {
        callback: (microappData) => {
          this.microappService.setMicroAppData(microappData);
          this._configService.setMicroAppData(microappData);
          this.getUserInfo();
        }
      }
    })
  }

  getUserInfo() {
    this.pubsubService.publishEvent('ce_user_info_request', {
      detail: {
        callback: (userInfo) => {
          const usrDtls = (userInfo.detail !== undefined) ? userInfo.detail : userInfo
          this.utilityService.SetAppData(usrDtls);
          let path = this.microappService.getMicroAppData()?.microAppInfo[this.title]?.path || '.';
          let microAppBaseUrlArray = path.split('/');
          microAppBaseUrlArray.pop();
          this.utilityService.SetMicroBaseUrl(microAppBaseUrlArray.join('/'));
          userInfo.detail = userInfo.detail || userInfo;
          const lang = (userInfo.detail) ? userInfo.detail.language : userInfo.language;
          this.ngZone.run(() => {
            this.getTranslation(lang || 'en');
            this.translateService.setDefaultLang(lang || 'en');
            this.translateService.use(lang || 'en');
          });

        }
      }
    })
  }


  subscribeToLangChange(event): void {
    this.ngZone.run(() => {
      this.getTranslation(event.detail);
    });
  }

  subscribeToPsScroll(event): void {
    this.ngZone.run(() => {
      this._stickyService.setStickyFor(event.detail.y);
    });
  }

  getTranslation(language: any): void {
    this.pubsubService.publishEvent('ce_translation_request', {
      detail: {
          callback: (res) => {  
            this.translateService.use(res.currentLang);
            this.translateService.setTranslation(res.currentLang, res.translation, true);
            this.cdr.detectChanges();
          },
          moduleName: 'MxAdmin'
      },
    });
  }



  ngOnInit() {
    this.route = this.sanitizer.sanitize(SecurityContext.HTML, this.elementRef.nativeElement.getAttribute('route'));
    this.ngZone.run(() => {
      this.router.navigateByUrl(""); // For Standalone development
      // this.router.navigateByUrl("home/widget/custom-admin/" + this.route); // For Production development
    });
  }


  updateView() {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 200);
  }

}
