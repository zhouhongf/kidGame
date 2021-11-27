import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-mains-shape',
  templateUrl: './mains-shape.component.html',
  styleUrls: ['./mains-shape.component.scss'],
})
export class MainsShapeComponent implements OnInit, OnDestroy {
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
  lastLoc = { x: 0, y: 0 };   // 初始位置值
  lastTimestamp;
  drawSpeed = 0;

  dataUrl;

  pointsCheck = [];
  pointsMatch = [];
  shapeRatio = 1;

  pointColor = 'rgba(255,0,0,0.25)';
  // 每条边10个小圆圈，半径为10，每个圆心间隔40
  squareShape = {
    p:[
        {x:20,y:20},{x:60,y:20},{x:100,y:20},{x:140,y:20},{x:180,y:20},{x:220,y:20},{x:260,y:20},{x:300,y:20},{x:340,y:20},{x:380,y:20},
        {x:380,y:60},{x:380,y:100},{x:380,y:140},{x:380,y:180},{x:380,y:220},{x:380,y:260},{x:380,y:300},{x:380,y:340},{x:380,y:380},
        {x:340,y:380},{x:300,y:380},{x:260,y:380},{x:220,y:380},{x:180,y:380},{x:140,y:380},{x:100,y:380},{x:60,y:380},{x:20,y:380},
        {x:20,y:340},{x:20,y:300},{x:20,y:260},{x:20,y:220},{x:20,y:180},{x:20,y:140},{x:20,y:100},{x:20,y:60},{x:20,y:20}
        ],
    r: 10,
    color:'rgba(255,0,0,0.25)',
    differ: 20,
  }

  starShape = {
    p:[
      {x:200,y:20},{x:215,y:65},{x:230,y:110},
      {x:247,y:158},{x:295,y:158}, {x:347,y:158},
      {x:390,y:158},{x:350,y:190}, {x:310,y:215},
      {x:276,y:245},{x:290,y:290}, {x:305,y:335},
      {x:317,y:382},{x:275,y:360}, {x:240,y:330},
      {x:200,y:300},{x:155,y:330},{x:120,y:360},
      {x:82,y:382},{x:95,y:335},{x:110,y:290},
      {x:124,y:245},{x:85,y:215},{x:50,y:190},
      {x:10,y:158},{x:55,y:158},{x:100,y:158},
      {x:153,y:158},{x:170,y:110},{x:185,y:65},
      {x:200,y:20},
    ],
    r: 10,
    color:'rgba(255,0,0,0.25)',
    differ: 20,
  }


  constructor(private route: ActivatedRoute, private router: Router) {
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
  }

  saveImage() {
    this.dataUrl = this.canvasId.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = this.dataUrl;
    a.download = '我的图画';
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  beginStroke(point){
    this.pointsMatch = [];
    this.isMouseDown = true;
    this.lastLoc = this.windowToCanvas(point.x, point.y);
    this.lastTimestamp = new Date().getTime();
  }

  endStroke(){
    this.isMouseDown = false;
    console.log('=========== 完成的点是：', this.pointsMatch);
    this.drawResultWrong();
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
    const differenceRange = this.squareShape.differ;
    let firstPointIndex = 0;
    const pointsCheckTemp = this.pointsCheck;
    if (this.pointsMatch.length == 0) {
      for (let i=0; i < this.pointsCheck.length; i++) {
        const point = this.pointsCheck[i];
        const differ = this.calcDistance(pointCurrent, point);
        if (differ < differenceRange) {
          firstPointIndex = i;
          break;
        }
      }
      if (firstPointIndex != 0 && firstPointIndex != this.pointsCheck.length) {
        const head = pointsCheckTemp.slice(0, firstPointIndex);
        const tail = pointsCheckTemp.slice(firstPointIndex);
        this.pointsCheck = tail.concat(head);
      }
    }
    if (this.pointsMatch.length > 0 && this.pointsMatch.length === this.pointsCheck.length) {
      this.drawResultRight();
      this.isMouseDown = false;
      return;
    } else {
      const index = this.pointsMatch.length;
      const pointCheck = this.pointsCheck[index]
      const pointDistance = this.calcDistance(pointCurrent, pointCheck);
      console.log('差距是：', pointDistance);
      if(pointDistance < differenceRange) {
        console.log('在差距内的点是：', pointCheck);
        this.pointsMatch.push(pointCurrent);
      }
      // console.log('当前的达到的点是：', this.pointsMatch);
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
    this.getEraser();
    this.canvasId.removeAllListeners();

    this.canvasContext.save();
    this.canvasContext.strokeStyle = this.colorRight;
    const pointStart = this.pointsCheck[0];

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(pointStart.x, pointStart.y);
    for(let i=1; i < (this.pointsCheck.length - 1); i++) {
      const point = this.pointsCheck[i];
      this.canvasContext.lineTo(point.x, point.y);
    }
    this.canvasContext.closePath();
    this.canvasContext.stroke();

    this.canvasContext.restore();
  }

  drawResultWrong() {
    this.canvasId.removeAllListeners();
    this.canvasContext.save();

    this.canvasContext.strokeStyle = this.colorWrong;
    const pointStart = this.pointsMatch[0];
    if (pointStart) {
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(pointStart.x, pointStart.y);
      // console.log('开始的点是：', pointStart);
      for(let i=1; i < this.pointsMatch.length; i++) {
        const point = this.pointsMatch[i];
        // console.log('连接的点是：', point);
        this.canvasContext.lineTo(point.x, point.y);
      }
      // this.canvasContext.closePath();   // 与开头的点连接起来
      this.canvasContext.stroke();
    }

    this.canvasContext.restore();
  }


  drawShape() {
    this.pointsCheck = [];
    if (this.title === '圆形') {
      return this.drawCircle();
    } else if (this.title === '四边形') {
      return this.drawSquare();
    } else if (this.title === '五角星') {
      return this.drawStar();
    } else {
      alert('没有相应的绘画模板！');
    }
  }

  drawSquare() {
    this.canvasContext.save();

    const points = this.squareShape.p;
    const radius = this.squareShape.r;
    for (const point of points) {
      this.canvasContext.beginPath();
      const xNeed = point.x * this.shapeRatio;
      const yNeed = point.y * this.shapeRatio;
      this.canvasContext.arc(xNeed, yNeed, radius * this.shapeRatio, 0, Math.PI*2, true);
      this.canvasContext.closePath();
      this.canvasContext.fillStyle = this.squareShape.color;
      this.canvasContext.fill();

      this.pointsCheck.push({x: xNeed, y: yNeed});
    }

    this.canvasContext.restore();
    console.log('drawSquare需要检查的点有：', this.pointsCheck);
  }

  drawStar() {
    this.canvasContext.save();

    const points = this.starShape.p;
    const radius = this.starShape.r;
    for (const point of points) {
      this.canvasContext.beginPath();
      const xNeed = point.x * this.shapeRatio;
      const yNeed = point.y * this.shapeRatio;
      this.canvasContext.arc(xNeed, yNeed, radius * this.shapeRatio, 0, Math.PI*2, true);
      this.canvasContext.closePath();
      this.canvasContext.fillStyle = this.starShape.color;
      this.canvasContext.fill();

      this.pointsCheck.push({x: xNeed, y: yNeed});
    }

    this.canvasContext.restore();
    console.log('drawStar需要检查的点有：', this.pointsCheck);
  }


  drawCircle() {
    this.canvasContext.save();

    const rBig = 150;
    const rSmall = 10;
    this.canvasContext.strokeStyle = 'blue';
    // this.canvasContext.arc(this.canvasObj.canvasWidth/2, this.canvasObj.canvasHeight/2, rBig, 0, Math.PI*2)
    // this.canvasContext.stroke();
    for(let i=0; i<=360; i+=20) {
      this.canvasContext.beginPath();
      const x = Math.cos(Math.PI*2 / 360 * i) * rBig;
      const y = Math.sin(Math.PI*2 / 360 * i) * rBig;
      const pointX = (this.canvasObj.canvasWidth/2 + x) * this.shapeRatio;
      const pointY = (this.canvasObj.canvasHeight/2 + y) * this.shapeRatio;
      this.canvasContext.arc(pointX, pointY, rSmall, 0, Math.PI*2)
      this.canvasContext.closePath();
      this.canvasContext.fillStyle = this.pointColor;
      this.canvasContext.fill();

      this.pointsCheck.push({x: pointX, y: pointY});
    }

    this.canvasContext.restore();
    console.log('drawCircle需要检查的点有：', this.pointsCheck);
  }



}
