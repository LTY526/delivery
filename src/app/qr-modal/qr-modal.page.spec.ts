import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QrModalPage } from './qr-modal.page';

describe('QrModalPage', () => {
  let component: QrModalPage;
  let fixture: ComponentFixture<QrModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QrModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
