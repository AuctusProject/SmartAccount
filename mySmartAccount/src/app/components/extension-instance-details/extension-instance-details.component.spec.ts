import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtensionInstanceDetailsComponent } from './extension-instance-details.component';

describe('ExtensionInstanceDetailsComponent', () => {
  let component: ExtensionInstanceDetailsComponent;
  let fixture: ComponentFixture<ExtensionInstanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionInstanceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionInstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
