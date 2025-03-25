import { Component, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';


@Component({
    selector: 'mx-ac-info-popup',
    templateUrl: './mx-info-popup.component.html',
    styleUrls: ['./mx-info-popup.component.scss'],
    standalone: false
})
export class MxInfoPopupComponent {
  successimgurl = './assets/icons/success_icon.svg';
  errorimgurl = './assets/icons/error_icon.svg';
  infoImgUrl = './assets/icons/info_icon.svg';
  constructor(@Optional() public dialogRef: MatDialogRef<MxInfoPopupComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private route: Router, private configService: MxAdmConfigService) { }

  mxPopupActionHander(data) {
    this.dialog.closeAll();
    if (data.popupType === 'Success') {
      if ((data.popupAction === 'suspend') || (data.popupAction === 'edit') ||
        (data.popupAction === 'active') || (data.popupAction === 'create') || (data.popupAction === 'resetDevice') ||
        (data.popupAction === 'resetPwd')) {
        this.route.navigate(['home/widget/custom-admin/customer-management-list']);
      } else if (data.popupAction === 'generateOtac') {
        this.route.navigate(['home/widget/custom-admin/customer-account-activation-list']);
      } else if (data.popupAction === 'delete') {
        this.route.navigate(['/home/widget/custom-admin/transaction-management-list']);
      }
      else if (data.popupAction === 'deletePaymentTypeConfiguration') {
        this.route.navigate(['/home/widget/custom-admin/payment-type-configuration-list']);
      }
      else if (data.popupAction === 'deletePaymentCutOff') {
        this.route.navigate(['/home/widget/custom-admin/payment-cutoff-list']);
      }
    } else if (data.popupType === 'Info') {
      if (data.popupAction === 'logout') {
        this.logout();
      }
    }

  }

  logout() {
    let baseUrl = this.configService.get('merchant').baseUrl;
    baseUrl = window.location.origin;
    const customAdminParams = JSON.parse(sessionStorage.getItem('customAdminParams'));
    sessionStorage.setItem('customAdminParams', '');
    window.location.href = customAdminParams.logoutUrl;
  }

}
