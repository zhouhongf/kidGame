import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainsComponent} from './mains.component';
import {MainsHomeComponent} from './mains-home/mains-home.component';
import {MainsShapeComponent} from "./mains-shape/mains-shape.component";
import {MainsTestComponent} from "./mains-test/mains-test.component";
import {MainsPhotoComponent} from "./mains-photo/mains-photo.component";
import {MainsMenuComponent} from "./mains-menu/mains-menu.component";
import {MainsMazeComponent} from "./mains-maze/mains-maze.component";
import {MainsDragComponent} from "./mains-drag/mains-drag.component";
import {MainsTalkComponent} from "./mains-talk/mains-talk.component";


const mainsRoutes: Routes = [{
  path: '', component: MainsComponent,
  children: [
    { path: 'home', component: MainsHomeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'menu', component: MainsMenuComponent},
    { path: 'shape', component: MainsShapeComponent},
    { path: 'photo', component: MainsPhotoComponent},
    { path: 'maze', component: MainsMazeComponent},
    { path: 'drag', component: MainsDragComponent},
    { path: 'talk', component: MainsTalkComponent},
    { path: 'test', component: MainsTestComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(mainsRoutes)],
  exports: [RouterModule]
})
export class MainsRoutingModule { }
