import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {MainsRoutingModule} from './mains-routing.module';
import {MainsComponent} from './mains.component';
import {MainsHomeComponent} from './mains-home/mains-home.component';
import {MainsShapeComponent} from "./mains-shape/mains-shape.component";
import {MainsTestComponent} from "./mains-test/mains-test.component";
import {MainsPhotoComponent} from "./mains-photo/mains-photo.component";
import {MainsMenuComponent} from "./mains-menu/mains-menu.component";
import {MainsMazeComponent} from "./mains-maze/mains-maze.component";
import {MainsDragComponent} from "./mains-drag/mains-drag.component";
import {MainsTalkComponent} from "./mains-talk/mains-talk.component";


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        MainsRoutingModule
    ],
    declarations: [
        MainsComponent,
        MainsHomeComponent,
        MainsTestComponent,
        MainsMenuComponent,
        MainsShapeComponent,
        MainsPhotoComponent,
        MainsMazeComponent,
        MainsDragComponent,
        MainsTalkComponent,
    ]
})
export class MainsModule {
}
