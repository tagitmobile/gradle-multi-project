import { Component, OnInit, Optional, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { ApiService } from 'mx-custom-admin-library';
import { AppService } from '../../../core/modules/services/app.service';
import { User } from '../../../core/modules/models/users.model';
import { map } from 'rxjs/operators';
import { UserInfoModule } from '../../../core/modules/models/userinfo.model';
import { PubsubService } from '../../../core/modules/common/pubsub.service';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';
import { Router } from '@angular/router';

@Component({
    selector: 'mx-ac-feedback-popup',
    templateUrl: './mx-feedback-popup.component.html',
    styleUrls: ['./mx-feedback-popup.component.css'],
    standalone: false
})
export class MxFeedbackPopupComponent implements OnInit {
  feedback = '';
  feedBackForm: UntypedFormGroup;
  userData;
  feedRef: MatDialogRef<MxFeedbackPopupComponent>;
  constructor(@Optional() public dialogRef: MatDialogRef<MxFeedbackPopupComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private cdr: ChangeDetectorRef,
    // private apiService: ApiService,
    private appService: AppService, private pubsubservice: PubsubService
  ) { }

  ngOnInit() {
    this.userData = this.appService.selectedUser;
    this.feedBackForm = new UntypedFormGroup({
      feedback: new UntypedFormControl('', {
        validators: [Validators.required, Validators.maxLength(255)]
      })
    });
  }

  /**
   * handling action buttons
   */
  onActionHandler() {
    const dialogData = this.data.actions[0];
    if (dialogData.data.action === 'suspend') {
      this.data = {
        type: 'feedback', heading: 'confirmPopup.title',
        actions: [{ name: 'common.yes', color: '#ffb700', data: { action: 'feedback_suspend', userID: '123123' } },
        { name: 'common.no' }]
      };
    } else if (dialogData.data === 'suspend_request') {
      const feedbackPopup = {
        heading: 'CONFIRM_POPUP.REASON_FOR_SUSPEND',
        type: 'suspend',
        mcifuuid: this.data.mcifuuid,
        actions: [{
          name: "COMMON.SUBMIT",
          data: {
            action: "feedback_suspend"
          },
          color: "#00bdcd"
        },
        {
          name: "COMMON.CANCEL",
          data: 'suspend'
        }]
      };
      this.feedRef = this.dialog.open(MxFeedbackPopupComponent, {
        height: '241px',
        width: '420px',
        data: feedbackPopup
      });
      this.dialogRef.close('Pizza!');
    } else if (dialogData.data.action === 'active') {
      this.data = {
        type: 'feedback', heading: 'confirmPopup.title',
        actions: [{ name: 'common.yes', color: '#ffb700', data: { action: 'feedback_active', userID: '123123' } },
        { name: 'common.no' }]
      };

    } else if (dialogData.data.action === 'resetPwd') {
    } else if (dialogData.data.action === 'resetDevice') {
    } else if (dialogData.data.action === 'delete') {
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/blackouts/' + this.data.blackoutUuid,
          data: '',
          urlParams: '',
          options: { params: {} },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              const successdata = {
                msg: 'TRANSACTION.TRANSACTION_DELETE_SUCCESS_MSG',
                ref: responseData.txnBlackoutWorkflowSDO.workflowId
              };
              this.appService.successPopup('delete', successdata);
            }
          }
        },
      });
    } else if (dialogData.data.action === 'deletePaymentCutOff') {
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/payment-cutoffs/' + this.data.cutOffKey,
          data: '',
          urlParams: '',
          options: { params: {} },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              const successdata = {
                msg: 'PAYMENT_CUTOFF.PAYMENT_CUTOFF_DELETE_SUCCESS_MSG',
                ref: responseData.workflowId
              };
              this.appService.successPopup('deletePaymentCutOff', successdata );
            }
          }
        },
      });
    }
    else if (dialogData.data.action === 'deletePaymentTypeConfiguration') {
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'transaction/' + this.data.payTypeKey,
          data: '',
          urlParams: '',
          options: {
            params: {
              appId: 'RB',
              groupId: 'MOBEIX'
            }
          },
          method: 'delete',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              const successdata = {
                msg: 'PAYMENT_TYPE_CONFIGURATION.PAYMENT_DELETE_SUCCESS_MSG',
                ref: responseData.workflowId
              };
              this.appService.successPopup('deletePaymentTypeConfiguration', successdata );
            }
          }
        },
      });
    }
    else if (dialogData.data.action === 'back_to_transactionList') {
      this.dialogRef.close();
      this.router.navigate(['/home/widget/custom-admin/transaction-management-list']);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 500);
    }
    else if (dialogData.data.action === 'back_to_paymentCutoffList') {
      this.dialogRef.close();
      this.router.navigate(['/home/widget/custom-admin/payment-cutoff-list']);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 500);
    }
    else if (dialogData.data.action === 'back_to_paymentTypeConfiguration') {
      this.dialogRef.close();
      this.router.navigate(['/home/widget/custom-admin/payment-type-configuration-list']);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 500);
    } else if (dialogData.data.action === 'generate_activate_code') {
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/activations/activate',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              this.appService.successPopup('generateOtac', 'CONFIRM_POPUP.CUST_GENERATE_ACTIVATION_CODE_SUCCESS_MSG' + responseData.workflowId);
            }
          }
        },
      });
    }
    /*
    feedback component actions*/
    if (dialogData.data.action === 'feedback_suspend') {
      const userInfo = {} as UserInfoModule;
      if (this.feedBackForm.valid) {
        const mcifuuid = this.data.mcifuuid;
        const options = {
          headers: {},
          params: { mcifuuiduserid: mcifuuid, remarks: this.feedBackForm.get('feedback').value, appId: 'RB' }
        };
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
              console.log('responseData', responseData);
              if (responseData) {
                this.appService.successPopup('suspend', 'CONFIRM_POPUP.CUST_SUSPEND_SUCCESS_MSG' + responseData.workflowId);
              }
            }
          },
        });
      }
    } else if (dialogData.data.action === 'feedback_active') {
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/activate',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              this.appService.successPopup('active', 'CONFIRM_POPUP.CUST_ACTIVATE_SUCCESS_MSG' + responseData.workflowId);
            }
          }
        },
      });
    }
    else if (dialogData.data.action === 'resetPwd') {
      const mcifuuid = this.data.mcifuuid;
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/resetPassword',
          data: '',
          urlParams: '',
          options: { params: { mcifuuiduserid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              this.appService.successPopup('active', 'CONFIRM_POPUP.CUST_RESET_PASSWORD_SUCCESS_MSG' + responseData.workflowId);
            }
          }
        },
      });
    }
    else if (dialogData.data.action === 'reset_device') {
      const mcifuuid = this.data.mcifuuid;
      this.data.action = 'reset_device';
      const options = {
        headers: {},
        params: { mcifuuiduserid: mcifuuid, appId: 'RB' }
      };
      this.pubsubservice.publishEvent('ce_api_request', {
        detail: {
          endpoint: 'customers/reset-device',
          data: '',
          urlParams: '',
          options: { params: { mcifuuid: mcifuuid, appId: 'RB' } },
          method: 'post',
          callback: (res) => {
            const responseData = res.detail.body;
            console.log('responseData', responseData);
            if (responseData) {
              this.appService.successPopup('active', 'CONFIRM_POPUP.CUST_RESET_DEVICE_SUCCESS_MSG' + responseData.workflowId);
            }
          }
        },
      });
    }
  }
}
