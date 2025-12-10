import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoracionCrud } from './decoracion-crud';

describe('DecoracionCrud', () => {
  let component: DecoracionCrud;
  let fixture: ComponentFixture<DecoracionCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecoracionCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecoracionCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
