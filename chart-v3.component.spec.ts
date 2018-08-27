import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartV3Component } from './chart-v3.component';

describe('ChartV3Component', () => {
  let component: ChartV3Component;
  let fixture: ComponentFixture<ChartV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartV3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
