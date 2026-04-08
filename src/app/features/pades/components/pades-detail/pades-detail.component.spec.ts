import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadesDetailComponent } from './pades-detail.component';

describe('PadesDetailComponent', () => {
  let component: PadesDetailComponent;
  let fixture: ComponentFixture<PadesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadesDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PadesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
