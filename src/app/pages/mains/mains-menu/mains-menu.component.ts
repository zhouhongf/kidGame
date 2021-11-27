import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-mains-menu',
  templateUrl: './mains-menu.component.html',
  styleUrls: ['./mains-menu.component.scss'],
})
export class MainsMenuComponent implements OnInit {
  title;
  backgroundUrl = 'url(assets/images/edu/backgroundTwo.jpg)';
  targetUrl;

  linksOne = [
    {name: '连线四边形', url: '/mains/shape', param: '四边形', imgUrl: 'assets/images/edu/四边形.png'},
    {name: '连线五角星', url: '/mains/shape', param: '五角星', imgUrl: 'assets/images/edu/五角星.png'},
    {name: '连线圆形', url: '/mains/shape', param: '圆形', imgUrl: 'assets/images/edu/圆形.png'},
  ];
  linksTwo = [
    {name: '五官学习', url: '/mains/photo', param: '五官学习', imgUrl: 'assets/images/edu/headerChild.png'},
  ];
  linksThree = [
    {name: '垃圾分类', url: '/mains/maze', param: '垃圾分类', imgUrl: 'assets/images/edu/mazeOne.jpg'},
  ];
  linksFour = [
    {name: '放置水果', url: '/mains/drage', param: '放置水果', imgUrl: 'assets/images/edu/apple.jpg'},
  ];
  linksFive = [
    {name: '认识动作', url: '/mains/talk', param: '认识动作', imgUrl: 'assets/images/edu/talkOne.jpg'},
  ];


  linksCurrent = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      this.title = data.get('param');
      this.chooseLinks();
    });
  }

  chooseLinks() {
    switch (this.title) {
      case '连线画图':
        this.linksCurrent = this.linksOne;
        this.targetUrl = '/mains/shape';
        break;
      case '五官学习':
        this.linksCurrent = this.linksTwo;
        this.targetUrl = '/mains/photo';
        break;
      case '迷宫练习':
        this.linksCurrent = this.linksThree;
        this.targetUrl = '/mains/maze';
        break;
      case '图片配对':
        this.linksCurrent = this.linksFour;
        this.targetUrl = '/mains/drag';
        break;
      case '看图对话':
        this.linksCurrent = this.linksFive;
        this.targetUrl = '/mains/talk';
        break;
      default:
        this.linksCurrent = [];
        this.targetUrl = '/';
    }
  }

  goToPage(data) {
    return this.router.navigate([this.targetUrl, {param: data.param}])
  }

}
