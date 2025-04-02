import { TestBed } from '@angular/core/testing';

import { MicroappService } from './microapp.service';

describe('MicroappService', () => {
  let service: MicroappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
