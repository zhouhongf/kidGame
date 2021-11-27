import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsTestComponent } from './mains-test.component';

describe('MainsTestComponent', () => {
  let component: MainsTestComponent;
  let fixture: ComponentFixture<MainsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
