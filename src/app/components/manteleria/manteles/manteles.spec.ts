import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manteles } from './manteles';

describe('Manteles', () => {
  let component: Manteles;
  let fixture: ComponentFixture<Manteles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manteles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manteles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
