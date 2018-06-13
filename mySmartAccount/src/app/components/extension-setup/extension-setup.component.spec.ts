import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionSetupComponent } from './extension-setup.component';

describe('ExtensionSetupComponent', () => {
  let component: ExtensionSetupComponent;
  let fixture: ComponentFixture<ExtensionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
