import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ViewService {
    locationViewData: any = {};
    fileViewData: any = {};
    customerViewData: any = {};
    transactionViewData: any = {};
    paymentTypeConfigurationViewData: any = {};
    paymentCutoffConfigurationViewData: any = {};
    backAction:any ;
    viewCustomer(viewData, btndata) {
        this.customerViewData = { viewData, btndata };
    }
    viewLocation(viewData) {
        this.locationViewData = viewData;
    }
    viewFile(viewData) {
        this.fileViewData = viewData;
    }
    viewTrasactionBlackout(viewData, btndata) {
        this.transactionViewData = { viewData, btndata };
    }
    viewPaymentTypeConfiguration(viewData, btndata) {
        this.paymentTypeConfigurationViewData = { viewData, btndata };
    }
    viewPaymentCuttoffConfiguration(viewData, btndata) {
        this.paymentCutoffConfigurationViewData = { viewData, btndata };
    }
    OnBack(naviagescreen){
        this.backAction = naviagescreen;
    }
}
