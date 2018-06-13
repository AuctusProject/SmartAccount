import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtensionParameterComponent } from './extension-parameter.component';

describe('ExtensionParameterComponent', () => {
  let component: ExtensionParameterComponent;
  let fixture: ComponentFixture<ExtensionParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
