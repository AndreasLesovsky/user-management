import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEntityModal } from './delete-entity-modal';

describe('DeleteEntityModal', () => {
  let component: DeleteEntityModal;
  let fixture: ComponentFixture<DeleteEntityModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEntityModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEntityModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
