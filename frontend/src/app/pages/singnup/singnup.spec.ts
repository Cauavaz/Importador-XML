import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingnupComponent } from './singnup';

describe('SingnupComponent', () => {
  let component: SingnupComponent;
  let fixture: ComponentFixture<SingnupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingnupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingnupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
