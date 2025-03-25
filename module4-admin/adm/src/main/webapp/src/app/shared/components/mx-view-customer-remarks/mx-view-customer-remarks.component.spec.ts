import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MXViewCustomerRemarksComponent } from './mx-view-customer-remarks.component';

describe('MXViewCustomerRemarksComponent', () => {
  let component: MXViewCustomerRemarksComponent;
  let fixture: ComponentFixture<MXViewCustomerRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MXViewCustomerRemarksComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MXViewCustomerRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
