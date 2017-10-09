import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtransactionComponent } from './viewtransaction.component';

describe('ViewtransactionComponent', () => {
  let component: ViewtransactionComponent;
  let fixture: ComponentFixture<ViewtransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
