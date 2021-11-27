import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../../providers/base.service";

@Component({
  selector: 'app-mains-maze',
  templateUrl: './mains-maze.component.html',
  styleUrls: ['./mains-maze.component.scss'],
})
export class MainsMazeComponent implements OnInit, OnDestroy {
  photoUse = 'assets/images/edu/mazeOne.jpg';
  title;

  canvasId: any;
  canvasContext: any;
  // canvas的大小设置
  canvasObj = {canvasWidth: 400, canvasHeight: 400};
  bgColor = '#00f';
  colorRight = '#0f0';
  colorWrong = '#f00';

  lineWidth = 10;             // 画笔的大小
  isMouseDown = false;
  lastLoc = {x: 0, y: 0};   // 初始位置值
  lastTimestamp;
  drawSpeed = 0;

  pointsCheck = [];
  pointsMatch = [];
  shapeRatio = 1;

  targetShape = {
    p:[
      {x:185,y:50},
      {x:185,y:100},{x:230,y:100},
      {x:230,y:130},{x:140,y:130},
      {x:140,y:165},{x:270,y:165},
      {x:270,y:200}, {x:100,y:200},
      {x:100,y:230},{x:320,y:230},
      {x:320,y:260},{x:60,y:260},
      {x:60,y:280}
    ],
    r: 10,
    color:'rgba(255,0,0,0.25)',
    differ: 20,
  }

  timeStart;
  timeEnd;    // 考试预定结束时间
  timeOver;   // 考试真正结束时间

  timePerQuestion = 6000;   // 单位：1分钟
  timeUp = false;


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private baseService: BaseService
  ) {
  }

  ngOnInit() {
    console.log('------------- 执行ngOnInit ---------------')
    const windowWidth = window.innerWidth - 20;
    const windowHeight = window.innerHeight;
    console.log('窗口宽和高：', windowWidth, windowHeight)
    if (windowWidth < this.canvasObj.canvasWidth) {
      this.shapeRatio = windowWidth / this.canvasObj.canvasWidth;
    }

    this.route.paramMap.subscribe(data => {
      this.canvasId = document.getElementById('canvas');
      this.canvasContext = this.canvasId.getContext('2d');
      this.canvasId.width = Math.min(this.canvasObj.canvasWidth, windowWidth);
      this.canvasId.height = this.canvasId.width;
      this.title = data.get('param');
      this.pointsMatch = [];
      this.drawCanvas();
      this.drawShape();
    });
  }

  ngOnDestroy() {
    console.log('------------- 执行ngOnDestroy ---------------')
    this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
    this.pointsCheck = [];
  }

  // 橡皮擦：canvas的高度及宽度重置
  getEraser() {
    this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
    this.drawCanvas();
    this.drawShape();
    this.pointsMatch = [];
    this.timeStart = new Date().getTime();
    this.timeEnd = this.timeStart + this.pointsCheck.length * this.timePerQuestion;
    this.timeUp = false;
  }


  beginStroke(point){
    this.isMouseDown = true;
    this.lastLoc = this.windowToCanvas(point.x, point.y);
    this.lastTimestamp = new Date().getTime();
  }

  endStroke(){
    this.isMouseDown = false;
    console.log('=========== 完成的点是：', this.pointsMatch);
  }

  moveStroke(point){
    const curLoc = this.windowToCanvas(point.x , point.y);  // 获得当前坐标
    const curTimestamp = new Date().getTime();              // 当前时间
    const s = this.calcDistance(curLoc, this.lastLoc);      // 获得运笔距离
    const t = curTimestamp - this.lastTimestamp;            // 运笔时间
    const speed = this.calcLineWidth(t,s);
    // this.canvasContext.lineWidth = speed;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.lastLoc.x, this.lastLoc.y);
    this.canvasContext.lineTo(curLoc.x, curLoc.y);
    // this.canvasContext.strokeStyle = this.bgColor;
    this.canvasContext.lineCap = 'round'
    this.canvasContext.lineJoin = 'round'
    this.canvasContext.stroke();

    this.lastLoc = curLoc;
    this.lastTimestamp = curTimestamp;
    this.drawSpeed = speed;
  }


  // 绘制画板中内容
  drawCanvas() {
    if (this.bgColor) {
      this.canvasContext.fillStyle = this.bgColor;
      this.canvasContext.strokeStyle = this.bgColor;
    }
    if (this.lineWidth) {
      this.canvasContext.lineWidth = this.lineWidth;
    }
    this.canvasId.addEventListener('touchstart', e => {
      e.preventDefault();
      const touch = e.touches[0]    // 获得坐标位置
      this.beginStroke({x: touch.pageX, y: touch.pageY})
    })
    this.canvasId.addEventListener('touchmove', e => {
      e.preventDefault();
      if (this.isMouseDown) {
        const touch = e.touches[0]
        this.moveStroke({x: touch.pageX, y: touch.pageY})
      }
    })
    this.canvasId.addEventListener('touchend', e => {
      e.preventDefault();
      this.endStroke();
    })

    this.canvasId.onmousedown = (e) => {
      e.preventDefault();
      // console.log('...按下onmousedown', e.pageX, e.pageY, e.clientX, e.clientY);
      this.beginStroke({x: e.clientX, y: e.clientY})
    }
    // 鼠标按下，松开，移动，离开事件执行
    this.canvasId.onmouseup = (e) => {
      e.preventDefault();
      // console.log('...松开onmouseup', e.pageX, e.pageY);
      this.endStroke();
    }
    this.canvasId.onmouseout = (e) => {
      e.preventDefault();
      this.endStroke();
    }
    this.canvasId.onmousemove = (e) => {
      e.preventDefault();
      if (this.isMouseDown) {
        this.moveStroke({x: e.clientX, y: e.clientY})
      }
    }
  }



  /**
   * 获取canvas坐标
   */
  windowToCanvas(x, y) {
    const ctxbox = this.canvasId.getBoundingClientRect();
    const pointCurrent = { x: Math.round(x - ctxbox.left), y: Math.round(y - ctxbox.top) };
    console.log('canvas坐标', pointCurrent.x, pointCurrent.y);
    this.checkPointMatch(pointCurrent);
    return pointCurrent;
  }

  checkPointMatch(pointCurrent) {
    const differenceRange = this.targetShape.differ;
    if (this.pointsMatch.length > 0 && this.pointsMatch.length === this.pointsCheck.length) {
      this.drawResultRight();
      this.isMouseDown = false;
      this.timeOver = new Date().getTime();
      this.timeUp = true;
      return;
    } else {
      const index = this.pointsMatch.length;
      const pointCheckTemp = this.pointsCheck[index]
      if (this.pointsMatch.indexOf(pointCheckTemp) === -1) {
        const pointCheckList = pointCheckTemp.split('=')
        const pointCheck = {x: Number(pointCheckList[0]), y: Number(pointCheckList[1])}
        const pointDistance = this.calcDistance(pointCurrent, pointCheck);
        console.log('差距是：', pointDistance);
        if(pointDistance < differenceRange) {
          console.log('在差距内的点是：', pointCheck);
          this.pointsMatch.push(pointCurrent);
        }
        // console.log('当前的达到的点是：', this.pointsMatch);
      }
    }
  }

  /**
   * 求两点之间距离
   */
  calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
  }

  /**
   * 求速度
   */
  calcLineWidth(t,s){
    const v = s/t;
    let resultLineWidth;
    if(v <= 0.1){
      resultLineWidth=30;
    }else if(v >= 10){
      resultLineWidth = 1;
    }else{
      resultLineWidth = 30 - (v-0.1)/(10-0.1)*(30-1);
    }
    if(this.lineWidth === -1){
      return resultLineWidth;
    }
    return this.lineWidth*2/3+resultLineWidth*1/3;
  }


  drawResultRight() {
    this.timeUp = true;

    this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
    this.canvasId.removeAllListeners();

    const image = new Image();
    image.src = this.photoUse;
    const width = Math.min(window.innerWidth, this.canvasObj.canvasWidth);
    const height = Math.min(window.innerHeight, this.canvasObj.canvasHeight);
    image.onload = () => {
      this.canvasContext.drawImage(image, 0, 0, width, height);
      const imageData = this.canvasContext.getImageData(0, 0, width, width);
      this.canvasContext.putImageData(imageData, 0, 0);

      const pointStartTemp = this.pointsCheck[0].split('=');
      const pointStart = {x: Number(pointStartTemp[0]), y: Number(pointStartTemp[1])};
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(pointStart.x, pointStart.y);
      for(let i=1; i < this.pointsCheck.length; i++) {
        const point = this.pointsCheck[i].split('=');
        this.canvasContext.lineTo(Number(point[0]), Number(point[1]));
      }
      this.canvasContext.lineWidth = this.lineWidth;
      this.canvasContext.strokeStyle = this.colorRight;
      this.canvasContext.stroke();
    }
  }


  drawShape() {
    const image = new Image();
    image.src = this.photoUse;
    const width = Math.min(window.innerWidth, this.canvasObj.canvasWidth);
    const height = Math.min(window.innerHeight, this.canvasObj.canvasHeight);
    image.onload = () => {
      this.canvasContext.drawImage(image, 0, 0, width, height);
      const imageData = this.canvasContext.getImageData(0, 0, width, width);
      this.canvasContext.putImageData(imageData, 0, 0);
    }

    this.pointsCheck = [];
    const points = this.targetShape.p;
    for (const one of points) {
      const pointIn = one['x'].toString() + '=' + one['y'].toString();
      this.pointsCheck.push(pointIn);
    }
    console.log('需要检查的点有：', this.pointsCheck);
    this.timeStart = new Date().getTime();
    this.timeEnd = this.timeStart + this.pointsCheck.length * this.timePerQuestion;
  }


  doTimeUp(event) {
    console.log('倒计时时间到了: ', event);
    this.baseService.alert('时间到了');
    this.doEndExam();
  }

  doEndExam() {
    this.timeUp = true;
    this.timeOver = new Date().getTime();
    this.canvasId.removeAllListeners();
    this.isMouseDown = false;
  }

}
