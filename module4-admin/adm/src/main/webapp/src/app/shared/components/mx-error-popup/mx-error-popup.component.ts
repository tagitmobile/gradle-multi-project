import { Component, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from '../../../core/modules/common/utility.service';

@Component({
    selector: 'mx-ac-error-popup',
    templateUrl: './mx-error-popup.component.html',
    styleUrls: ['./mx-error-popup.component.scss'],
    standalone: false
})
export class MxErrorPopupComponent {
  successimgurl = './assets/icons/success_icon.svg';
  errorimgurl = this.utilityService.microAppBaseURL + '/assets/icons/error_icon.svg';
  infoImgUrl = './assets/icons/info.svg';
  constructor(@Optional() public dialogRef: MatDialogRef<MxErrorPopupComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private readonly route: Router, private readonly utilityService: UtilityService,) { }

  mxPopupActionHander(data) {
    this.dialog.closeAll();
    if (data.popupType === 'Success') {
      if ((data.popupAction === 'suspend') || (data.popupAction === 'edit') ||
        (data.popupAction === 'active') || (data.popupAction === 'create') || (data.popupAction === 'resetDevice') ||
        (data.popupAction === 'resetPwd')) {
        this.route.navigate(['user/user-list-view']);
      }
    }
  }
}
