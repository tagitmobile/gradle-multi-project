import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MxInfoPopupComponent } from '../../../shared/components/mx-info-popup/mx-info-popup.component';
import { MxAdmConfigService } from '@tagit/mx-admin-library/api';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  selectedUser;
  private modals: any[] = [];
  constructor(public dialog: MatDialog, private configService: MxAdmConfigService) { }

  successPopup(action, res) {
    let popupData;
    // refId: '12345', 
    this.dialog.closeAll();
    if (res.ref) {
      popupData = {
        refId: res.ref, message: res.msg, heading: 'COMMON.SUCCESS', popupAction: action, popupType: 'Success'
      };
    } else {
      popupData = {
        message: res, heading: 'COMMON.SUCCESS', popupAction: action, popupType: 'Success'
      };
    }
    if (res.ref) {
      this.dialog.open(MxInfoPopupComponent, {
        data: popupData,
        disableClose: true,
        height: '266px',
        width: '431px'
      });
    } else {
      this.dialog.open(MxInfoPopupComponent, {
        data: popupData,
        disableClose: true,
        height: '260px',
        width: '421px'
      });
    }
  }
  errorPopup(res) {
    let popupData;
    // refId: '12345', 
    this.dialog.closeAll();
    popupData = {
      message: res, popupType: 'error'
    };
    this.dialog.open(MxInfoPopupComponent, {
      data: popupData,
      disableClose: true,
      height: '260px',
      width: '421px'
    });
  }

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find(x => x.id === id);
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.modals.find(x => x.id === id);
    modal.close();
  }

  logout() {
    const customAdminParams = JSON.parse(sessionStorage.getItem('customAdminParams'));
    sessionStorage.setItem('customAdminParams', '');
    window.location.href = customAdminParams.logoutUrl;
  }
}

