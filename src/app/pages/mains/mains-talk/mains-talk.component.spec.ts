import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsTalkComponent } from './mains-talk.component';

describe('MainsTalkComponent', () => {
  let component: MainsTalkComponent;
  let fixture: ComponentFixture<MainsTalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsTalkComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
