import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphv2Component } from './graph3d.component';

describe('Graphv2Component', () => {
  let component: Graphv2Component;
  let fixture: ComponentFixture<Graphv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphv2Component]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Graphv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
