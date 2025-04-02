import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxModalViewComponent } from './mx-modal-view.component';

describe('MxModalViewComponent', () => {
  let component: MxModalViewComponent;
  let fixture: ComponentFixture<MxModalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxModalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxModalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
