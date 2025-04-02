import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MXViewCustomerComponent } from './mx-view-customer.component';

describe('MXViewCustomerComponent', () => {
  let component: MXViewCustomerComponent;
  let fixture: ComponentFixture<MXViewCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MXViewCustomerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MXViewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
