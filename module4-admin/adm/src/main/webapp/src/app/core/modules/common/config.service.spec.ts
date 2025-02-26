import { TestBed } from '@angular/core/testing';

import { MxConfigService } from './config.service';

describe('ConfigService', () => {
  let service: MxConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MxConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
