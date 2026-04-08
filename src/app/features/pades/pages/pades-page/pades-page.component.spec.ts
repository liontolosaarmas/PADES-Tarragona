import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadesPageComponent } from './pades-page.component';

describe('PadesPageComponent', () => {
  let component: PadesPageComponent;
  let fixture: ComponentFixture<PadesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PadesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
