import { TestBed } from '@angular/core/testing';

import { GeneralUtilsService } from './general-utils.service';

describe('GeneralUtilsService', () => {
  let service: GeneralUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
