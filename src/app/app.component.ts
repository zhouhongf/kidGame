import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {MediaMatcher} from "@angular/cdk/layout";
import {NavigationEnd, Router} from "@angular/router";
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaQueryList: MediaQueryList;
  private _mediaQueryListener: () => void;
  private _eventType = 'resize';

  worker;
  navigationSubscription;

  userAvatarDefault = 'assets/images/ionic-person.svg';
  nickname = '昵称';
  userAvatar = this.userAvatarDefault;

  theBasePages = [
    {title: '连线画图', url: '/mains/menu', param: '连线画图'},
    {title: '五官学习', url: '/mains/menu', param: '五官学习'},
    {title: '迷宫练习', url: '/mains/menu', param: '迷宫练习'},
    {title: '图片配对', url: '/mains/menu', param: '图片配对'},
    {title: '看图对话', url: '/mains/menu', param: '看图对话'},
  ];

  theServicePages = [];
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private changeDetectorRef: ChangeDetectorRef,
      private mediaMatcher: MediaMatcher,
      private menu: MenuController,
      private router: Router,
      private speechRecognition: SpeechRecognition,
  ) {
  }

  ngOnInit() {
    this.initializeApp();
    this.setMobileQuery();
    this.startWorker();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      this.requestSpeechPermission();
    });
  }

  requestSpeechPermission() {
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (hasPermission === false) {
        this.speechRecognition.requestPermission().then(
            () => console.log('Granted'),
            () => console.log('Denied')
        );
      }
    });
  }

  startWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('./app.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      this.worker.postMessage('hello');
    }
  }

  setMobileQuery() {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(min-width: 3600px)');
    this._mediaQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mediaQueryList.addEventListener(this._eventType, this._mediaQueryListener);
  }

  ngOnDestroy() {
    this.mediaQueryList.removeEventListener(this._eventType, this._mediaQueryListener);
    if (this.worker) {
      this.worker.terminate();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  goToPage(url) {
    return this.router.navigate([url]).then(() => {
      this.menu.close('mains');
    });
  }

  goToPageWithParam(data) {
    return this.router.navigate([data.url, {param: data.param}]).then(() => {
      this.menu.close('mains');
    });
  }
}
