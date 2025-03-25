import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxModalComponent } from './mx-modal.component';

describe('MxModalComponent', () => {
  let component: MxModalComponent;
  let fixture: ComponentFixture<MxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
