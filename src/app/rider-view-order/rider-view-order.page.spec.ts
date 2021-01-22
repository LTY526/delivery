import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RiderViewOrderPage } from './rider-view-order.page';

describe('RiderViewOrderPage', () => {
  let component: RiderViewOrderPage;
  let fixture: ComponentFixture<RiderViewOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderViewOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RiderViewOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
