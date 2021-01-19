import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopListPage } from './shop-list.page';

describe('ShopListPage', () => {
  let component: ShopListPage;
  let fixture: ComponentFixture<ShopListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
