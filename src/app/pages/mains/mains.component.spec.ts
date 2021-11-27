import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsComponent } from './mains.component';

describe('MainsComponent', () => {
  let component: MainsComponent;
  let fixture: ComponentFixture<MainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
