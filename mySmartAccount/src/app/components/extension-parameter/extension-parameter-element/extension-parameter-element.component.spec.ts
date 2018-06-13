import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtensionParameterElementComponent } from './extension-parameter-element.component';

describe('ExtensionParameterElementComponent', () => {
  let component: ExtensionParameterElementComponent;
  let fixture: ComponentFixture<ExtensionParameterElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionParameterElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionParameterElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
