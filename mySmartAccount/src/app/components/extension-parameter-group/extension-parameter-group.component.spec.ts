import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionParameterGroupComponent } from './extension-parameter-group.component';

describe('ExtensionParameterGroupComponent', () => {
  let component: ExtensionParameterGroupComponent;
  let fixture: ComponentFixture<ExtensionParameterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionParameterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionParameterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
