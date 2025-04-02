import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxButtonComponent } from './mx-button.component';

describe('MxButtonComponent', () => {
  let component: MxButtonComponent;
  let fixture: ComponentFixture<MxButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
