import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlimeComponent } from './interlime.component';

describe('InterlimeComponent', () => {
  let component: InterlimeComponent;
  let fixture: ComponentFixture<InterlimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterlimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterlimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
