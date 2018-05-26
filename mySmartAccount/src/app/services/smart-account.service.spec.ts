import { TestBed, inject } from '@angular/core/testing';

import { SmartAccountService } from './smart-account.service';

describe('SmartAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartAccountService]
    });
  });

  it('should be created', inject([SmartAccountService], (service: SmartAccountService) => {
    expect(service).toBeTruthy();
  }));
});
