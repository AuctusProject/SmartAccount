import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthBalanceComponent } from './eth-balance.component';

describe('EthBalanceComponent', () => {
  let component: EthBalanceComponent;
  let fixture: ComponentFixture<EthBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
