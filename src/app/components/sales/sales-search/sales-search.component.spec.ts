import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSearchComponent } from './sales-search.component';

describe('SalesSearchComponent', () => {
  let component: SalesSearchComponent;
  let fixture: ComponentFixture<SalesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
