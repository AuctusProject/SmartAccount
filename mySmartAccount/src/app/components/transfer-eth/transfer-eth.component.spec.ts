import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferEthComponent } from './transfer-eth.component';

describe('TransferEthComponent', () => {
  let component: TransferEthComponent;
  let fixture: ComponentFixture<TransferEthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferEthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
