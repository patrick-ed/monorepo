import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PingPageComponent } from './ping-page.component';

describe('PingPageComponent', () => {
  let component: PingPageComponent;
  let fixture: ComponentFixture<PingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
