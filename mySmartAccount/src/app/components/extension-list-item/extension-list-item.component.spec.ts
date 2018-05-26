import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionListItemComponent } from './extension-list-item.component';

describe('ExtensionListItemComponent', () => {
  let component: ExtensionListItemComponent;
  let fixture: ComponentFixture<ExtensionListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
