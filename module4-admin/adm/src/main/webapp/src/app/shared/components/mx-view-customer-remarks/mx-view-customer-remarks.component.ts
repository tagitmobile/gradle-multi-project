import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
// import { ApiService, ConfigService, CustomDatePipe } from 'mx-custom-admin-library';
import { MxInfoPopupComponent } from '../mx-info-popup/mx-info-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MxFeedbackPopupComponent } from '../mx-feedback-popup/mx-feedback-popup.component';
// import { ViewService } from '../../services/view.service';
// import { AppService } from '../../services/app.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { PubsubService } from '../../../core/modules/common/pubsub.service';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';
import { MxAdmCustomCurrencyPipe, MxAdmCustomDatePipe } from '@tagit/mx-admin-library/pipes';
import { LocaleService } from '../../../core/modules/services/locale.service';
import { UtilityService } from '../../../core/modules/common/utility.service';
@Component({
    selector: 'mx-ac-view-customer-remarks',
    templateUrl: './mx-view-customer-remarks.component.html',
    styleUrls: ['./mx-view-customer-remarks.component.scss'],
    standalone: false
})
export class MXViewCustomerRemarksComponent implements OnInit {
  workflow = true;
  custDetails: any = [];
  customerMgmtReference: any;
  infoRef: MatDialogRef<MxInfoPopupComponent>;
  feedRef: MatDialogRef<MxFeedbackPopupComponent>;
  btndata: any;
  rejectForm: UntypedFormGroup;
  @Output() successScreenResponse = new EventEmitter();
  @Output() reviewScreenResponse = new EventEmitter();
  @Input() reject: any;
  reviewScreen: any;
  @Input() viewData: any;
  @Input() subTitle: any;
  reasonTabLabel: any;
  workflowId: any;
  permissions$ = ['PUT', 'DELETE', 'GET', 'POST'];
  userTypeMode$: 'ADMIN';
  filterChanged = new Subject();
  advSearchConfig: any;
  headersWorkFlowList: any[] = [
    { name: 'CIF Number', prop: 'cifNo', sortable: true, width: '25%' },
    { name: 'Authentication Type', prop: 'authenticationType', sortable: true, width: '20%' },
    { name: 'Account  Type', prop: 'accountTypeId', sortable: true, width: '20%' },
    { name: 'Account Number', prop: 'accountId', sortable: true, width: '20%' }
  ];
  headersWorkFlowList1: any[] = [
    { name: 'CIF Number', prop: 'cifId', sortable: true, width: '25%' },
    { name: 'Host Name', prop: 'hostName', sortable: true, width: '20%' },
    { name: 'Customer Name', prop: 'customerName', sortable: true, width: '20%' },
    { name: 'Status', prop: 'status', sortable: true, width: '20%' }
  ];
  filterValue1;
  listSdo = 'linkedCifDetails';
  sdo = 'userSto';
  tableData = [];
  table2Data: { data: any; }[];
  tablerecord = [];
  public destroyed = new Subject<any>();

  constructor(private router: Router, private stepper: MatStepper, private configService: MxAdmConfigService, private dialog: MatDialog, private fb: UntypedFormBuilder,
    private formatdate: MxAdmCustomDatePipe, private pubsubservice: PubsubService, private localeService: LocaleService, private utilityService: UtilityService, private cdr: ChangeDetectorRef, private formatcurrency: MxAdmCustomCurrencyPipe,) {

  }
  ngOnInit() {
    this.reasonTabLabel = [
      {
        name: "Request Type",
        value: this.viewData.recordName || this.viewData.workflowDetailResponse.recordName
      }
    ];
    this.onConfigureStaticAcctDetailsData(this.viewData);
    if (this.reject) {
      this.rejectForm = this.fb.group({
        remark: ['', Validators.required]
      });
    }
    if (this.reject && this.reviewScreen) {
      const val = "sbsbsb";
      this.rejectForm.get('remark').setValue(val);
      // this.rejectForm.get('remark').disable;
    }
  }

  onConfigureStaticAcctDetailsData(response): void {
    if (this.viewData.recordType === 'TXN_BLACKOUT') {
      this.customerMgmtReference = response.sdoObj.workflowId ? response.sdoObj.workflowId : '';
      this.custDetails = [];
      this.custDetails[0] = {};
      this.custDetails[0]['title'] = 'TRANSACTION.TRANS_BLACKOUT_DETAILS';
      this.custDetails[0]['fieldDetails'] = [];
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('TRANSACTION.TRANS_TYPE', response.sdoObj.transTypeDescription || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('TRANSACTION.TRANS_BLACKOUT_START_DATE', response.sdoObj.startDate || '', 'DATE'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('TRANSACTION.TRANS_BLACKOUT_END_DATE', response.sdoObj.endDate || '', 'DATE'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('TRANSACTION.TRANS_BLACKOUT_MSG', response.sdoObj.message || '', 'TEXT'));
    }
    else if (this.viewData.recordType === 'PAY_TYPE_CONFIG') {
      this.customerMgmtReference = response.workflowId || '';
      this.custDetails = [];
      this.custDetails[0] = {};
      this.custDetails[0]['title'] = 'PAYMENT_TYPE_CONFIGURATION.PAYMENT_TYPE_DETAILS';
      this.custDetails[0]['fieldDetails'] = [];
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.PAYMENT_METHOD', response.sdoObj.payMethod.payMethodDesc || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.PAYMENT_TYPE', response.sdoObj.payType || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.PAYMENT_DESCRIPTION', response.sdoObj.payTypeDesc || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.PAYEE_BANK', response.sdoObj.payeebankinddesc || ''));
      this.custDetails[1] = {};
      this.custDetails[1]['title'] = 'PAYMENT_TYPE_CONFIGURATION.HOLIDAY_CONFIGURATION_DETAILS';
      this.custDetails[1]['fieldDetails'] = [];
      this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.HOLIDAY_CHECK', response.sdoObj.holidayChk || ''));
      if (response.sdoObj.holidayCheck === true) {
        this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('PAYMENT_TYPE_CONFIGURATION.HOLIDAY_TYPE', response.sdoObj.holidaytype || ''));
      }
    } else if (this.viewData && this.viewData.recordType === 'PAYMENT_CUTOFF') {
      this.customerMgmtReference = response.workflowId || '';
      this.workflowId = response.workflowId;
      this.custDetails = [];
      this.custDetails[0] = {};
      this.custDetails[0]['title'] = 'PAYMENT_CUTOFF.PAYMENT_CUTOFF_DETAILS';
      this.custDetails[0]['fieldDetails'] = [];
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYMENT_TYPE', response.sdoObj.payType.payType || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYMENT_DESCRIPTION', response.sdoObj.payType.payTypeDesc || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYMENT_COUNTRY', response.sdoObj.country.countryName || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYMENT_CURRENCY', response.sdoObj.paymentCurrency.ccyCode || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYEE_BANK', response.sdoObj.payType.payeeBankInd || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.ALLOWED_DEBIT_CURRENCY', response.sdoObj.debitCurrencies || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.ALLOWED_FUTURE_DAYS', response.sdoObj.allowedFutureDays || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.MINIMUM_PAYMENT_LIMIT', this.localeService.getformatCurrency(response.sdoObj.minPaymentLimit, response.payCurrency, false) || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.MAXMIMUM_PAYMENT_LIMIT', this.localeService.getformatCurrency(response.sdoObj.maxPaymentLimit, response.payCurrency, false) || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.PAYMENT_PREFERENCE', response.sdoObj.paymentPrefrence || '', 'TEXT'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.CLEARING_CUTOFF_START_TIME', response.sdoObj.clearingCutoffStartTime || '', 'DATE'));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureTransactionDetailsData('PAYMENT_CUTOFF.CLEARING_CUTOFF_END_TIME', response.sdoObj.clearingCutoffEndTime || '', 'DATE'));
    }
    else if (this.viewData.workflowDetailResponse && this.viewData.workflowDetailResponse.recordType === 'CUST_ACC_LINK') {
      // response = this.viewData.workflowDetailResponse;
      this.customerMgmtReference = response.workflowDetailResponse.sdoObj.customerMgmtReference || '';
      this.workflowId = response.workflowDetailResponse.workflowId;
      this.custDetails = [];
      this.custDetails[0] = {};
      this.custDetails[0]['title'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_BASIC_INFORMATION';
      this.custDetails[0]['fieldDetails'] = [];
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_USER_ID', response.workflowDetailResponse?.sdoObj.userId || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_NAME', response.workflowDetailResponse?.sdoObj.customerName || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_CIFNO', response.workflowDetailResponse?.sdoObj.cifNo || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MOBILE', response.workflowDetailResponse?.sdoObj.userMobileNo || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_EMAIL_ID', response.workflowDetailResponse?.sdoObj.userEmail || ''));
      this.custDetails[1] = {};
      this.custDetails[1]['title'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_PERSONAL_INFORMATION';
      this.custDetails[1]['fieldDetails'] = [];
      this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MARITAL_STATUS', response.workflowDetailResponse?.sdoObj.userName || ''));
      this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_DATE_OF_BIRTH', response.workflowDetailResponse?.sdoObj.dateOfBirth || ''));
      // this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MOBILE', response.workflowDetailResponse?.sdoObj.userMobileNo || ''));
      // this.custDetails[1]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_EMAIL_ID', response.workflowDetailResponse?.sdoObj.userEmail || ''));
      this.custDetails[2] = {};
      this.custDetails[2]['title'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_LINK_CIF_DETAILS';
      this.custDetails[2]['subtitle'] = [];
      this.custDetails[2]['subtitle'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_CIF_DETAILS';
      this.custDetails[2]['subfieldDetails'] = [];
      this.custDetails[2]['subfieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_USER_ID', response.workflowDetailResponse?.sdoObj.userId || ''));
      this.custDetails[2]['subfieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_NAME', response.workflowDetailResponse?.sdoObj.customerName || ''));
      this.custDetails[2]['subfieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_CIFNO', response.workflowDetailResponse?.sdoObj.cifNo || ''));
      this.custDetails[2]['subfieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MOBILE', response.workflowDetailResponse?.sdoObj.userMobileNo || ''));
      this.custDetails[2]['subfieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_EMAIL_ID', response.workflowDetailResponse?.sdoObj.userEmail || ''));
      this.custDetails[2]['subtitle1'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_PERSONAL_INFORMATION';
      this.custDetails[2]['subfieldDetails1'] = [];
      this.custDetails[2]['subfieldDetails1'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MARITAL_STATUS', response.workflowDetailResponse?.sdoObj.userName || ''));
      this.custDetails[2]['subfieldDetails1'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_DATE_OF_BIRTH', response.workflowDetailResponse?.sdoObj.dateOfBirth || ''));
      this.custDetails[3] = {};
      this.custDetails[3]['title'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_OTHER_LINKED_CIF_DETAILS';
      // this.custDetails[2]['subtitle'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_CIF_DETAILS';
      // const table = response.workflowDetailResponse?.sdoObj;
      //  ? response.workflowDetailResponse?.sdoObj : [];
      this.tablerecord = [response.workflowDetailResponse?.sdoObj];
      this.tableData = [
        {
          data: this.tablerecord
        }
      ];
      const table2 = response?.[this.listSdo];
      this.table2Data = [
        {
          data: table2
        }
      ]
    }
    else {
      this.reasonTabLabel.push({
        name: "Reason",
        value: response.sdoObj.remarks
      });
      this.customerMgmtReference = response.sdoObj.customerMgmtReference || '';
      this.workflowId = response.workflowId;
      // this.reasonTabLabel[0]['value'] = response.recordName || '';
      this.custDetails = [];
      this.custDetails[0] = {};
      this.custDetails[0]['title'] = 'CUSTOMER_MANAGEMENT.CUSTOMER_BASIC_INFORMATION';
      this.custDetails[0]['fieldDetails'] = [];
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_USERNAME', response.sdoObj.userName || ''));
      // this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_FIRSTNAME', response.sdoObj.name || ''));
      // this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MIDDLENAME', response.sdoObj.address1 || ''));
      // this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_LASTNAME', response.sdoObj.address2 || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_CIFNO', response.sdoObj.cifNo || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_MOBILE', response.sdoObj.userMobileNo || ''));
      this.custDetails[0]['fieldDetails'].push(this.onConfigureCustomerDetailsData('CUSTOMER_MANAGEMENT.CUSTOMER_EMAIL_ID', response.sdoObj.userEmail || ''));
      let groupedValues;
      if (response.sdoObj.dynamicFeilds) {
        groupedValues = this.groupByKey(response.sdoObj.dynamicFeilds, 'groupLabel');
      }
      if (groupedValues) {
        let currentAccLength = this.custDetails.length;
        groupedValues.forEach((val, index) => {
          this.custDetails[(index + currentAccLength)] = {};
          this.custDetails[(index + currentAccLength)].title = val.title;
          this.custDetails[(index + currentAccLength)].fieldDetails = [];
          if (val.fieldDetails) {
            val.fieldDetails.forEach(v => {
              this.custDetails[(index + currentAccLength)].fieldDetails.push(this.onConfigureCustomerDetailsData(v.label,
                v.fieldType === 'DATE' ? this.formatdate.transform(v[v.fieldType.toLowerCase() + 'Value'], 'MMM dd, yyyy') : v[v.fieldType.toLowerCase() + 'Value']));
            });
          }
          if (index === (groupedValues.length - 1)) {
            this.custDetails[(index + currentAccLength)].isMatDivider = true;
          }
        });
      }
      console.log(this.custDetails, groupedValues);
    }
  }
  onConfigureTransactionDetailsData(label, value, type): any {
    if (type === 'DATE') {
      if (this.viewData.recordType === 'PAYMENT_CUTOFF') {
        value = this.formatdate.transform(value, 'hh:mm:ss a')
      } else {
        value = this.formatdate.transform(value, 'MMM dd, yyyy hh:mm:ss a zzzz')
      }
    }
    return {
      label, value
    };
  }
  onConfigureCustomerDetailsData(label, value): any {
    return {
      label, value
    };
  }
  groupByKey(array, key) {
    const groupedObj = array.reduce((prev, cur) => {
      (prev[cur[key]] = prev[cur[key]] || []).push(cur);
      return prev;
    }, {});
    // tslint:disable-next-line:max-line-length
    return Object.keys(groupedObj).map((key, index) => ({ title: key, fieldDetails: groupedObj[key] }));
  }

  activateCustSubmit() {
    const options = {
      headers: {},
      params: { action: 'APPROVED', workflowId: this.workflowId, appId: 'RB', remarks: '' }
    };
    const language = this.utilityService.language || '';
    this.pubsubservice.publishEvent('ce_api_request', {
      detail: {
        endpoint: 'workflows/actions',
        data: '',
        urlParams: '',
        options: { params: { action: 'APPROVED', workflowId: this.workflowId, appId: 'RB', remarks: '' }, headers: { "Accept-Language": language } },
        method: 'put',
        callback: (res) => {
          const responseData = res.detail.body;
          console.log('responseData', responseData);
          if (responseData) {
            this.successScreenResponse.emit(responseData);
            this.stepper.next();
          }
        }
      },
    });
  }
  rejectsubmit() {
    const options = {
      headers: {},
      params: { action: 'REJECTED', workflowId: this.workflowId, appId: 'RB', remarks: this.rejectForm.get('remark').value }
    };
    const language = this.utilityService.language || '';
    this.pubsubservice.publishEvent('ce_api_request', {
      detail: {
        endpoint: 'workflows/actions',
        data: '',
        urlParams: '',
        options: { params: { action: 'REJECTED', workflowId: this.workflowId, appId: 'RB', remarks: this.rejectForm.get('remark').value }, headers: { "Accept-Language": language }, },
        method: 'put',
        callback: (res) => {
          const responseData = res.detail.body;
          console.log('responseData', responseData);
          if (responseData) {
            this.successScreenResponse.emit(responseData);
            this.stepper.next();
          }
        }
      },
    });
  }
  cancel() {
    this.router.navigate(['/home/widget/custom-admin/workflow-management-list']);
    // setTimeout(() => {
    //   this.cdr.detectChanges();
    // }, 500);
  }

  stepperBack() {
    this.stepper.reset();
    this.reviewScreen = false;
  }

  rejectremarks() {
    this.reviewScreenResponse.emit({ viewData: this.viewData, remarks: this.rejectForm.get('remark').value });
    console.log({ viewData: this.viewData, remarks: this.rejectForm.get('remark').value })
    this.stepper.next();
  }
}