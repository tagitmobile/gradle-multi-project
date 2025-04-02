import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../../core/modules/common/utility.service';
@Component({
    selector: 'mx-ac-cust-breadcrumb',
    templateUrl: './mx-breadcrumb.component.html',
    styleUrls: ['./mx-breadcrumb.component.scss'],
    standalone: false
})
export class MXBreadcrumbComponent implements OnInit {
  @Input() breadcrumbUrls?: any;
  imageUrl: any;
  constructor(private router: Router, private utilityService: UtilityService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): any {
    this.imageUrl = this.utilityService.microAppBaseURL;
    console.log('imageUrl', this.imageUrl);
  }
  onClickAction(actionurl): any {
    if (actionurl.action !== undefined && actionurl.actionIcon === true) {
      this.router.navigate([actionurl.action]);
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 500);
    }
  }
}
