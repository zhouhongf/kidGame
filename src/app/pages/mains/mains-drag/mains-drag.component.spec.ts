import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsDragComponent } from './mains-drag.component';

describe('MainsDragComponent', () => {
  let component: MainsDragComponent;
  let fixture: ComponentFixture<MainsDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsDragComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
