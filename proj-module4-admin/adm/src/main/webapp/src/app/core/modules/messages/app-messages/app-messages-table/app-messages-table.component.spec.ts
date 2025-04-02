import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMessagesTableComponent } from './app-messages-table.component';

describe('AppMessagesTableComponent', () => {
  let component: AppMessagesTableComponent;
  let fixture: ComponentFixture<AppMessagesTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMessagesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMessagesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
