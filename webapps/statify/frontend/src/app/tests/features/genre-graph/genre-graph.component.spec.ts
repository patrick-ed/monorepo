import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreGraphComponent } from '../../../features/genre-graph/genre-graph.component';

describe('GenreGraphComponent', () => {
  let component: GenreGraphComponent;
  let fixture: ComponentFixture<GenreGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
