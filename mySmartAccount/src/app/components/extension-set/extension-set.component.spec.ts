import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionSetComponent } from './extension-set.component';

describe('ExtensionSetComponent', () => {
  let component: ExtensionSetComponent;
  let fixture: ComponentFixture<ExtensionSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
