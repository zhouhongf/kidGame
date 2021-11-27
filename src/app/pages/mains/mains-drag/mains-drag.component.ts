import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../../providers/base.service";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import {TextToSpeech} from "@ionic-native/text-to-speech/ngx";

@Component({
  selector: 'app-mains-drag',
  templateUrl: './mains-drag.component.html',
  styleUrls: ['./mains-drag.component.scss'],
})
export class MainsDragComponent implements OnInit {
  appleUrl = 'assets/images/edu/apple.jpg';
  grapeUrl = 'assets/images/edu/grape.jpg';
  basketUrl = 'url(assets/images/edu/basket.png)';
  isMobile;

  title;
  dragPositionOne = {x: 0, y: 0};
  dragPositionTwo = {x: 0, y: 0};
  differenceRange = 100;

  dragPositionTargetOne = {x: 360, y: 710};
  dragPositionTargetTwo = {x: 220, y: 710};

  // 收到消息 声音通知
  onSuccess: any = '你真棒';
  onError: any = '错误';

  showApple = true;
  showGrape = true;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private baseService: BaseService,
      private nativeAudio: NativeAudio,
      private tts: TextToSpeech,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.baseService.isMobile();
    if (this.isMobile) {
      this.nativeAudio.preloadSimple('uniqueId2', 'assets/sounds/bell.mp3').then(this.onSuccess, this.onError);
    }
    console.log('------------- 执行ngOnInit ---------------')
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    console.log('窗口宽和高：', windowWidth, windowHeight)
    const tempLength = Math.round(windowWidth / 4);
    this.dragPositionTargetOne.x = tempLength;
    this.dragPositionTargetTwo.x = tempLength * 3;

    this.route.paramMap.subscribe(data => {
      this.title = data.get('param');
    });
  }

  changePosition() {
    this.showApple = true;
    this.showGrape = true;
    this.dragPositionOne = {x: this.dragPositionOne.x, y: this.dragPositionOne.y};
    this.dragPositionTwo = {x: this.dragPositionTwo.x, y: this.dragPositionTwo.y};
  }

  doDragEvent(event, target) {
    let targetPosition = {};
    if (target === 'apple') {
      targetPosition = this.dragPositionTargetTwo;
    } else {
      targetPosition = this.dragPositionTargetOne;
    }
    const pointerPosition = event['pointerPosition'];
    console.log('位置是：', pointerPosition);
    const distance = this.calcDistance(pointerPosition, targetPosition);
    console.log('======== 位置距离是：', distance);
    if (distance < this.differenceRange) {
      this.doRight(target);
      if (target === 'apple') {
        setTimeout(() => this.showApple = false, 3000);
      } else {
        setTimeout(() => this.showGrape = false, 3000);
      }
    }
  }

  doRight(target) {
    if (this.isMobile) {
      this.nativeAudio.play('uniqueId2').then(this.onSuccess, this.onError);
    } else {
      this.baseService.presentToast('你真棒！' + target);
    }
  }


  calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
  }

  readMessage(content) {
    if (this.isMobile) {
      this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
          .then(() => console.log('Success'))
          .catch((reason: any) => console.log(reason));
    }
  }
}
