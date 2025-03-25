import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MicroappService } from '../../../core/modules/common/microapp.service';
import { UtilityService } from '../../../core/modules/common/utility.service';

@Component({
    selector: 'mx-ac-success',
    templateUrl: './mx-success.component.html',
    styleUrls: ['./mx-success.component.scss'],
    standalone: false
})
export class MxSuccessComponent implements OnInit, OnChanges, AfterViewInit {
  refID: any;
  successimgurl = './assets/icons/success_icon.svg';
  @Input() data: any;
  @Input() subTitle: any;
  imageUrl: string;

  constructor(private router: Router, private microAppService: MicroappService,
    private cdr: ChangeDetectorRef, private utilityService: UtilityService,) { }

  ngOnInit() {
    // this.imageUrl = this.microAppService.getMicroAppBaseUrlForApp('customer-management') || '.';
    this.successimgurl = this.utilityService.microAppBaseURL + '/assets/icons/success_icon.svg'
  }

  ngAfterViewInit() {
    this.dynamicData();
  }

  ngOnChanges() {
    this.dynamicData();
  }

  dynamicData() {
    if (this.data) {
      console.log(this.data);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 500);
      // this.refID = this.data.refID;
    }
  }

  backtoWorkflow(data, from?: any) {
    if (data === 'COMMON.BACK_LIST_VIEW') {
      if (from === 'Payment Type Configuration') {
        this.router.navigate(['home/widget/custom-admin/payment-type-configuration-list']);
        // setTimeout(() => {
        //   this.cdr.detectChanges();
        // }, 500);
      }
      else if (from === 'Transaction Management') {
        this.router.navigate(['home/widget/custom-admin/transaction-management-list']);
        // setTimeout(() => {
        //   this.cdr.detectChanges();
        // }, 500);
      }
      else if (from === 'Payment Cut-off Configuration') {
        this.router.navigate(['home/widget/custom-admin/payment-cutoff-list']);
        // setTimeout(() => {
        //   this.cdr.detectChanges();
        // }, 500);
      }
    } else {
      this.router.navigate(['home/widget/custom-admin/workflow-management-list']);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
  }

}

