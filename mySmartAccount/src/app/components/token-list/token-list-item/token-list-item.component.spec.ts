import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenListItemComponent } from './token-list-item.component';

describe('TokenListItemComponent', () => {
  let component: TokenListItemComponent;
  let fixture: ComponentFixture<TokenListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
