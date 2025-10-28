import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationSize } from './pagination-size';

describe('PaginationSize', () => {
  let component: PaginationSize;
  let fixture: ComponentFixture<PaginationSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
