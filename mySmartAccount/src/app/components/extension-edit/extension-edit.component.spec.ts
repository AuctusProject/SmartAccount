import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionEditComponent } from './extension-edit.component';

describe('ExtensionEditComponent', () => {
  let component: ExtensionEditComponent;
  let fixture: ComponentFixture<ExtensionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
