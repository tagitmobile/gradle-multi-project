import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxSuccessComponent } from './mx-success.component';

describe('MxSuccessComponent', () => {
  let component: MxSuccessComponent;
  let fixture: ComponentFixture<MxSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
