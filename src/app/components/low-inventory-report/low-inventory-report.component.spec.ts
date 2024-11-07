import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowInventoryReportComponent } from './low-inventory-report.component';

describe('LowInventoryReportComponent', () => {
  let component: LowInventoryReportComponent;
  let fixture: ComponentFixture<LowInventoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowInventoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
