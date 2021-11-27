import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsMazeComponent } from './mains-maze.component';

describe('MainsMazeComponent', () => {
  let component: MainsMazeComponent;
  let fixture: ComponentFixture<MainsMazeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsMazeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsMazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
