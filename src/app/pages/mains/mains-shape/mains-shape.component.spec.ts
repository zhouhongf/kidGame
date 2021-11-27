import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainsShapeComponent } from './mains-shape.component';

describe('MainsShapeComponent', () => {
  let component: MainsShapeComponent;
  let fixture: ComponentFixture<MainsShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainsShapeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainsShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
