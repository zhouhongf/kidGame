import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {BaseService} from '../../../providers/base.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mains-home',
  templateUrl: './mains-home.component.html',
  styleUrls: ['./mains-home.component.scss'],
})
export class MainsHomeComponent implements OnInit, OnDestroy {
  mediaQueryList: MediaQueryList;
  private _mediaQueryListener: () => void;
  private _eventType = 'resize';

  @ViewChild('mainHeader',  {static: false}) header;

  urlImageTwo = 'assets/images/coffeeLaptop.jpg';
  urlCodeOne = 'assets/images/codeWujiangxiaoyuer.jpg';

  constructor(
      private changeDetectorRef: ChangeDetectorRef,
      private mediaMatcher: MediaMatcher,
      private baseService: BaseService,
      private router: Router,
  ) {
  }

  ngOnInit() {
    this.setMobileQuery();
  }

  ngOnDestroy() {
    this.mediaQueryList.removeEventListener(this._eventType, this._mediaQueryListener);
  }

  setMobileQuery() {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(min-width: 1080px)');
    this._mediaQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mediaQueryList.addEventListener(this._eventType, this._mediaQueryListener);
  }


  scrollEvent(e) {
    const opacity = (e.detail.scrollTop - 300) / 300;       // 设置滚动距离300的时候导航栏出现
    this.header._elementRef.nativeElement.style.background = `rgba(255,255,255,${opacity})`;
  }

}
