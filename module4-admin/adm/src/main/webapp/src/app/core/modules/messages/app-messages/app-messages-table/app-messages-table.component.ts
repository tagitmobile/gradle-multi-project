import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
import { PubsubService } from '../../../common/pubsub.service';
import { MxAdmSearchConfig, MxAdmSearchParam } from '@tagit/mx-admin-library/mx-adm-advance-search';
import { MxAdmHeaderStickyService } from '@tagit/mx-admin-library/api';
import { MicroappService } from '../../../common/microapp.service';
import { HttpClient } from '@angular/common/http';
import { CommonConstants } from 'src/main/webapp/src/enums/common-constants.enum';
import { MxHeader } from '@tagit/mx-admin-library/models';

@Component({
    selector: 'mx-ac-app-messages-table',
    templateUrl: './app-messages-table.component.html',
    styleUrls: ['./app-messages-table.component.scss'],
    standalone: false
})
export class AppMessagesTableComponent implements OnInit {
  searchParams: MxAdmSearchParam[] = [
    { key: 'messageDesc', name: 'MX_AC_APP_MESSAGES.APP_MSG_APPMSG_MESSAGE_TYPE', type: 'text' },
    { key: 'appMsgCode', name: 'MX_AC_COMMON.COMMON_MESSAGE_CODE', type: 'text' },
    { key: 'appMessage', name: 'MX_AC_COMMON.COMMON_MESSAGE_DESC', type: 'text' },
    { key: 'langDesc', name: 'MX_AC_COMMON.COMMON_LANGUAGE', type: 'text' },
    { key: 'moduleName', name: 'MX_AC_COMMON.COMMON_MODULE', type: 'text' },
    { key: 'subModule', name: 'MX_AC_COMMON.COMMON_SUB_MODULE', type: 'text' }
  ];
  headers: MxHeader[] = [
    { name: 'MX_AC_APP_MESSAGES.APP_MSG_APPMSG_MESSAGE_TYPE', prop: 'messageDesc', sortable: false, width: '15%' },
    { name: 'MX_AC_COMMON.COMMON_MESSAGE_CODE', prop: 'appMsgCode', sortable: false, width: '16%' },
    { name: 'MX_AC_COMMON.COMMON_MESSAGE_DESC', prop: 'appMessage', sortable: false, width: '21%' },
    { name: 'MX_AC_COMMON.COMMON_LANGUAGE', prop: 'langDesc', sortable: false, width: '10%' },
    { name: 'MX_AC_COMMON.COMMON_MODULE', prop: 'moduleName', sortable: false, width: '15%' },
    { name: 'MX_AC_COMMON.COMMON_SUB_MODULE', prop: 'subModule', sortable: false, width: '15%' },
    { name: '', prop: 'action', type: 'menu', width: '8%' }
];
  permissions$ = ['GET', 'PUT', 'DELETE'];
  userTypeMode$: 'ADMIN';
  tableData;
  pageConfig = null;
  filterValue;
  count: number;
  pageParams;
  pageIndex = 0;
  pageChanges$ = new BehaviorSubject<{ page: number, size: number }>(null);
  searchChanges$ = new BehaviorSubject<any>(null);
  advSearchConfig: MxAdmSearchConfig;
  langDataFinal = [];
  langDescArr = [];
  constructor(private cdr: ChangeDetectorRef,
              private pubSubService: PubsubService,
              private microappService: MicroappService, 
              private http: HttpClient,
              private zone: NgZone,
              private _sticky: MxAdmHeaderStickyService) {  }

  ngOnInit() {
    // MX-HINT - For any service calls other than mobeix service, please use the below sample for the implementation. This will take care of extending the session
    // this.http.get('http://dummy.restapiexample.com/api/v1/employees').subscribe((data:any) => {
    //   // subscription logic goes here
    // });
    
    combineLatest([ // combining both the search and pagination in one API call
      this.searchChanges$.pipe(
        tap(_ => {
          this.pageParams = { page: 0, size: 10 };
          this.pageIndex = 0; // Resetting the page index to zero when the user tries to search the first page data in the last page
        })
      ),
      this.pageChanges$.pipe(
        tap(pageParams => {
          this.pageParams = pageParams;
          if (pageParams) {
            this.pageIndex = pageParams.page;
          }
        }))
    ]).pipe(
      skip(1)
    ).subscribe(([searchParams]) => {
      const page = this.pageParams ? this.pageParams.page : 0;
      const size = this.pageParams ? this.pageParams.size : 10;
      const searchData = searchParams ? searchParams.searchData : {};
      const filterType = searchParams ? searchParams.filterType : 'normal';
      this.listPostAppMessages(page, size, filterType, searchData);
    });
    this.advSearchConfig = {
      parameters: this.searchParams,
    };
    this.listPostAppMessages(0, 10);
  }

  callErrorAPI(): void {
    this.pubSubService.publishEvent('ce_api_request', {
      detail: {
        callback: (microappData) => {
        },
        errorCallback: (microappData) => {
          this.pubSubService.onErrorPopupDisplay(microappData);
        },
        appName: 'custom-admin',
        endpoint: 'samplerestapi/v1/api/sample/error/400',
        urlParams: '',
        options: {},
        method: 'get',
        moduleName: 'custom-admin'
      }
    });
  }


  
  listPostAppMessages(page: number, size: number, filterType?: 'normal' | 'advance', searchData?: any) {
    const qParams = {
      size: size.toString(),
      page: page.toString()
    }
    let headers = {};
    if (searchData && filterType) {
      headers = {
        intent: 'LIKE', isBasicSearch: filterType === 'normal' ? 'true' : 'false'
      }
    }
    const moduleName = this.microappService.getMicroAppData().microAppInfo ? (this.microappService.getMicroAppData().microAppInfo[CommonConstants.CUSTOM_ADMIN]?.moduleName) : "mxadmin";
    this.pubSubService.publishEvent('ce_api_request', {
      detail: {
        endpoint: 'mobeixadmin/api/appmsg/list',
        data: searchData,
        urlParams: '',
        options: { params: qParams, headers },
        method: 'post',
        route: 'app-messages-list',
        moduleName: moduleName,
        callback: (res) => {
          if(!res) return;
          this.count = res.detail.headers.get('X-Total-Count');
          const response = res.detail.body;
          if (response && response.length) {
            this.tableData = [
              {
                data: response
              }
            ];
            this.pageConfig = {
              itemPerPage: 10,
              sizeOption: [10, 20, 30]
            };
            this.cdr.detectChanges();
          } else {
            this.tableData = [];
            this.cdr.detectChanges();
          }
        },
        errorCallback: err => {
          console.error(err);
          this.cdr.detectChanges();
        }
      }
    });
  }

  onInput(value) {
    this._sticky.setInputValue(value);
    let searchData = {};
    const filterType = value.filterType;

    if (filterType === 'normal' && value.data) {
      searchData = { appMessage: value.data, appMsgCode: value.data };
    }

    else if (filterType === 'advance' && value.data) {
      if (Object.keys(value.data).every(key => value.data[key])) {
        searchData = value.data
      }
    }

    if (searchData) {
      this.searchChanges$.next({ searchData, filterType })
    }

  }

  OnPageChange(value) {
    this.pageChanges$.next({ page: value.pageIndex, size: value.pageSize });
  }

  onDownload() {
    const payload = { "exportType": "XML", "dataBaseType": "", "exportOperation": "INSERT", "version": 0, "status": "A" };
    const moduleName = this.microappService.getMicroAppData().microAppInfo ? (this.microappService.getMicroAppData().microAppInfo[CommonConstants.CUSTOM_ADMIN]?.moduleName) : "mxadmin";
    this.pubSubService.publishEvent('ce_download_api_request', {
      detail: {
        endpoint: 'mobeixadmin/api/appmsg/export', //sample
        data: payload,
        urlParams: '',
        moduleName: moduleName,
        options: { params: {} },
        method: 'POST',
        route: 'app-messages-list'
      },
      callback: res => {
        // res will have the response from backend
      },
      errorCallback: err => {
        console.error(err);
      }
    })
  }

 
}
