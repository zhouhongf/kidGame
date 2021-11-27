import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedAppComponent } from './shared-app.component';

describe('SharedAppComponent', () => {
  let component: SharedAppComponent;
  let fixture: ComponentFixture<SharedAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedAppComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
