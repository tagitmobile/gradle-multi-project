import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PubsubService } from '../../../core/modules/common/pubsub.service';
import { AppService } from '../../../core/modules/services/app.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserInfoModule } from '../../../core/modules/models/userinfo.model';
import { UtilityService } from '../../../core/modules/common/utility.service';

@Component({
    selector: 'mx-ac-modal-view',
    templateUrl: './mx-modal-view.component.html',
    styleUrls: ['./mx-modal-view.component.scss'],
    standalone: false
})
export class MxModalViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() inputData;
  data: any;
  feedBackForm: UntypedFormGroup;
  imageUrl: any;
  successimgurl: any;
  constructor(private pubsubservice: PubsubService, private elementRef: ElementRef,
    private router: Router, private appService: AppService, private cdr: ChangeDetectorRef,
    private utilityService: UtilityService,) { }

  ngOnInit() {
    this.imageUrl = this.utilityService.microAppBaseURL || '.';
    this.successimgurl = this.imageUrl + '/assets/icons/success_icon.svg';
    this.feedBackForm = new UntypedFormGroup({
      feedback: new UntypedFormControl('', {
        validators: [Validators.required, Validators.maxLength(255)]
      })
    });
  }

  ngOnChanges() {
    if (this.inputData) {
      this.data = this.inputData;
    }
  }

  onFormSubmit(id) {
    // this.appService.close(id);
  }
  onActionHandler(id: string, data?) {
    // this.appService.close(id);
    console.log(data);
    const dialogData = data;
    if (dialogData && dialogData.data && (dialogData.data.action === 'suspend')) {
      this.data = {
        type: 'feedback', heading: 'confirmPopup.title',
        actions: [
          {
            name: 'common.YES', color: '#ffb700',
            data: { action: 'feedback_suspend', userID: '123123' }
          },
          { name: 'common.COMMON.NO' }]
      };
    } else if (dialogData && dialogData.data === 'suspend_request') {
      const feedbackPopup = {
        heading: 'CONFIRM_POPUP.REASON_FOR_SUSPEND',
        type: 'suspend',
        mcifuuid: this.data.mcifuuid,
        actions: [
          {
            name: "COMMON.CANCEL",
            data: 'suspend_back'
          },
          {
          name: "COMMON.SUBMIT",
          data: {
            action: "feedback_suspend"
          },
          color: "#00bdcd"
        }
        
      ]
      };
      this.data = feedbackPopup;
      this.appService.open(id);
      // this.feedRef = this.dialog.open(MxFeedbackPopupComponent, {
      //   height: '241px',
      //   width: '420px',
      //   data: feedbackPopup
      // });
      // this.dialogRef.close('Pizza!');
    } else if (dialogData && dialogData.data && dialogData.data.action === 'active') {
      this.data = {
        type: 'feedback', heading: 'confirmPopup.title',
        actions: [{ name: 'common.YES', color: '#ffb700', data: { action: 'feedback_active', userID: '123123' } },
        { name: 'common.COMMON.NO' }]
      };

    } else if (dialogData && dialogData.data && dialogData.data.action === 'resetPwd') {
    } else if (dialogData && dialogData.data && dialogData.data.action === 'resetDevice') {
    } else if (dialogData && dialogData.data && dialogData.data.action === 'delete') {
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/blackouts/' + this.data.blackoutUuid,
          data: '',
          urlParams: '',
          options: {
            params: {
              appId: this.utilityService.appId
            }
          },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              const successdata = {
                msg: 'TRANSACTION.TRANSACTION_DELETE_SUCCESS_MSG',
                ref: responseData.txnBlackoutWorkflowSDO.workflowId
              };
              this.successPopup('delete', successdata);
            }
          }
        },
      });
    } else if (dialogData && dialogData.data && dialogData.data.action === 'deletePaymentCutOff') {
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/payment-cutoffs/' + this.data.cutOffKey,
          data: '',
          urlParams: '',
          options: { params: { appId: this.utilityService.appId } },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              const successdata = {
                msg: 'PAYMENT_CUTOFF.PAYMENT_CUTOFF_DELETE_SUCCESS_MSG',
                ref: responseData.workflowId
              };
              this.successPopup('deletePaymentCutOff', successdata);
            }
          }
        },
      });
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'deletePaymentTypeConfiguration') {
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/' + this.data.payTypeKey,
          data: '',
          urlParams: '',
          options: {
            params: {
              appId: this.utilityService.appId,
              groupId: 'MOBEIX'
            }
          },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              const successdata = {
                msg: 'PAYMENT_TYPE_CONFIGURATION.PAYMENT_DELETE_SUCCESS_MSG',
                ref: responseData.workflowId
              };
              this.successPopup('deletePaymentTypeConfiguration', successdata);
            }
          }
        },
      });
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'back_to_transactionList') {
      // this.dialogRef.close();
      this.appService.close(id);
      this.router.navigate(['/home/widget/custom-admin/transaction-management-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'back_to_paytypeList') {
      // this.dialogRef.close();
      this.appService.close(id);
      this.router.navigate(['/home/widget/custom-admin/payment-type-configuration-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'back_to_paycutoffList') {
      // this.dialogRef.close();
      this.appService.close(id);
      this.router.navigate(['/home/widget/custom-admin/payment-cutoff-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'back_to_paymentCutoffList') {
      // this.dialogRef.close();
      this.appService.close(id);
      this.router.navigate(['/home/widget/custom-admin/payment-cutoff-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'back_to_paymentTypeConfiguration') {
      // this.dialogRef.close();
      this.appService.close(id);
      this.router.navigate(['/home/widget/custom-admin/payment-type-configuration-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    } else if (dialogData && dialogData.data && dialogData.data.action === 'generate_activate_code') {
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/activations/activate',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              this.successPopup('generateOtac', { msg: 'CONFIRM_POPUP.CUST_GENERATE_ACTIVATION_CODE_SUCCESS_MSG', ref: responseData.workflowId });
            }
          }
        },
      });
    } else if (dialogData && (dialogData.data === 'active')) {
      // this.data = '';
      this.appService.close(id);
      // this.data = this.inputData;
    } else if (dialogData && dialogData.data && dialogData.data === 'suspend_back') {
      this.appService.close(id);
      this.feedBackForm.get('feedback').setValue('');
      this.feedBackForm.get('feedback').setErrors(null);
      this.feedBackForm.get('feedback').setValidators(null);
    }
    /*
    feedback component actions*/
    if (dialogData && dialogData.data && dialogData.data.action === 'feedback_suspend') {
      const userInfo = {} as UserInfoModule;
      if (this.feedBackForm.valid) {
        const mcifuuid = this.data.mcifuuid;
        const options = {
          headers: {},
          params: { mcifuuiduserid: mcifuuid, remarks: this.feedBackForm.get('feedback').value, appId: 'RB' }
        };
        this.appService.close(id);
        this.pubsubservice.publishEvent('ce_api_request', {
          detail: {
            endpoint: 'customers/suspend',
            data: '',
            urlParams: '',
            options: {
              params: {
                mcifuuiduserid: mcifuuid, remarks: this.feedBackForm.get('feedback').value, appId: 'RB'
              }
            },
            method: 'post',
            callback: (res) => {
              const responseData = res.detail.body;
              if (responseData) {
                this.cdr.detectChanges();
                this.successPopup('suspend', { msg: 'CONFIRM_POPUP.CUST_SUSPEND_SUCCESS_MSG', ref: responseData.workflowId });
              }
            }
          },
        });
      }
    } else if (dialogData && dialogData.data && dialogData.data.action === 'feedback_active') {
      // this.appService.close('custom-modal-1');
      // this.appService.close(id);
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/activate',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              // this.data = '';
              this.successPopup('active', { msg: 'CONFIRM_POPUP.CUST_ACTIVATE_SUCCESS_MSG', ref: responseData.workflowId });
            }
          }
        },
      });
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'resetPwd') {
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/resetPassword',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              // this.data = '';
              this.successPopup('active', { msg: 'CONFIRM_POPUP.CUST_RESET_PASSWORD_SUCCESS_MSG', ref: responseData.workflowId });
            }
          }
        },
      });
    }
    else if (dialogData && dialogData.data && dialogData.data.action === 'reset_device') {
      const mcifuuid = this.data.mcifuuid;
      this.data.action = 'reset_device';
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.appService.close(id);
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/reset-device',
          data: '',
          urlParams: '',
          options: { params: { mcifuuid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            if (responseData) {
              this.cdr.detectChanges();
              // this.data = '';
              this.successPopup('active', { msg: 'CONFIRM_POPUP.CUST_RESET_DEVICE_SUCCESS_MSG', ref: responseData.workflowId });
            }
          }
        },
      });
    } 
    // else {
    //   this.appService.close(id);
    //   this.feedBackForm.get('feedback').setValue('');
    // }

  }

  // successs popup 

  successPopup(action, res) {
    // debugger;
    // alert('success popup');
    // this.data = '';
    let popupData;
    if (res.ref) {
      popupData = {
        refId: res.ref, message: res.msg, heading: 'COMMON.SUCCESS', popupAction: action, type: 'Success'
      };
      // this.appService.close('custom-modal-1');
    } else {
      popupData = {
        message: res, heading: 'COMMON.SUCCESS', popupAction: action, type: 'Success'
      };
      // this.appService.close('custom-modal-1');
    }
    this.data = popupData;
    this.cdr.detectChanges();
    if (this.data) {
      this.appService.open('custom-modal-1');
    }
    this.feedBackForm.get('feedback').setValue('');
  }

  onCloseSuccessModal(id, data) {
    this.data = '';
    this.appService.close(id);
    if (data && data.type === 'Success') {
      if ((data.popupAction === 'suspend') || (data.popupAction === 'edit') ||
        (data.popupAction === 'active') || (data.popupAction === 'create') || (data.popupAction === 'resetDevice') ||
        (data.popupAction === 'resetPwd')) {
        this.router.navigate(['home/widget/custom-admin/customer-management-list']);
      } else if (data.popupAction === 'generateOtac') {
        this.router.navigate(['home/widget/custom-admin/customer-account-activation-list']);
      } else if (data.popupAction === 'delete') {
        this.router.navigate(['/home/widget/custom-admin/transaction-management-list']);
      }
      else if (data.popupAction === 'deletePaymentTypeConfiguration') {
        this.router.navigate(['/home/widget/custom-admin/payment-type-configuration-list']);
      }
      else if (data.popupAction === 'deletePaymentCutOff') {
        this.router.navigate(['/home/widget/custom-admin/payment-cutoff-list']);
      }
    } else if (data.type === 'Info') {
      if (data.popupAction === 'logout') {
        this.appService.logout();
      }
    }
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
