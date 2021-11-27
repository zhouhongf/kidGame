import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-mains-test',
  templateUrl: './mains-test.component.html',
  styleUrls: ['./mains-test.component.scss'],
})
export class MainsTestComponent implements OnInit {
  title;

  canvasId: any;
  canvasContext: any;
  // canvas的大小设置
  canvasObj = {canvasWith: 400, canvasHeight: 400};
  colorList = ['#f00', '#0f0', '#00f', '#000', '#fff']; // 指定画笔颜色
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
  differenceRange = 50;

  tangram=[
    {p:[{x:0,y:0},{x:800,y:0},{x:400,y:400}],color:"#BEDF64"},
    {p:[{x:0,y:0},{x:400,y:400},{x:0,y:800}],color:"#60ADC2"},
    {p:[{x:800,y:0},{x:800,y:400},{x:600,y:600},{x:600,y:200}],color:"#EB5564"},
    {p:[{x:600,y:200},{x:600,y:600},{x:400,y:400}],color:"#E9D91F"},
    {p:[{x:400,y:400},{x:600,y:600},{x:400,y:800},{x:200,y:600}],color:"#A092B9"},
    {p:[{x:200,y:600},{x:400,y:800},{x:0,y:800}],color:"#EA96C1"},
    {p:[{x:800,y:400},{x:800,y:800},{x:400,y:800}],color:"#E9B92B"}
  ]

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      this.title = data.get('param');
    });
    this.canvasId = document.getElementById('canvas');
    this.canvasContext = this.canvasId.getContext('2d');
    this.canvasId.width = this.canvasObj.canvasWith;
    this.canvasId.height = this.canvasObj.canvasHeight;
    this.drawGrid();
    this.drawCanvas();
  }

  // 设置画笔大小
  getLineWidth() {
    this.drawCanvas();
  }
  // 设置画笔颜色
  getBgColor(item) {
    this.bgColor = item;
    this.drawCanvas();
  }

  // 橡皮擦：canvas的高度及宽度重置
  getEraser() {
    // this.canvasId.width = this.canvasObj.canvasWith;
    // this.canvasId.height = this.canvasObj.canvasHeight;
    this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
    this.drawGrid();
    this.drawCanvas();
    this.pointsMatch = [];
  }

  saveImage() {
    this.dataUrl = this.canvasId.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = this.dataUrl;
    a.download = '我的书法';
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
    // const windowWidth = window.innerWidth;
    // const windowHeight = window.innerHeight;
    // console.log('窗口宽和高：', windowWidth, windowHeight)
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
    if (this.pointsMatch.length > 0 && this.pointsMatch.length === this.pointsCheck.length) {
      this.drawResultRight();
      return this.endStroke();
    }
    const index = this.pointsMatch.length;
    const pointCheck = this.pointsCheck[index]
    const pointDistance = this.calcDistance(pointCurrent, pointCheck);
    if(pointDistance < this.differenceRange) {
      this.pointsMatch.push(pointCurrent);
    }
    console.log('当前的达到的点是：', this.pointsMatch);
  }


  /**
   * 求两点之间距离
   */
  calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x)+(loc1.y - loc2.y)*(loc1.y - loc2.y));
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
      console.log('开始的点是：', pointStart);
      for(let i=1; i < this.pointsMatch.length; i++) {
        const point = this.pointsMatch[i];
        console.log('连接的点是：', point);
        this.canvasContext.lineTo(point.x, point.y);
      }
      // this.canvasContext.closePath();
      this.canvasContext.stroke();
    }

    this.canvasContext.restore();
  }

  // 画米字格
  drawGrid(){
    this.pointsCheck = [];
    this.canvasContext.save();   // 在画米字格之间，将前面设置的canvas的设置参数保存到堆栈

    this.canvasContext.strokeStyle = 'rgb(230,11,9)';

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(3,3);
    this.canvasContext.lineTo(this.canvasId.width - 3,3);
    this.canvasContext.lineTo(this.canvasId.width - 3,this.canvasId.height -3);
    this.canvasContext.lineTo(3,this.canvasId.height -3);
    this.canvasContext.closePath();
    this.canvasContext.lineWidth = 6;
    this.canvasContext.stroke();

    const pointOne = {x: 0, y: 0};
    const pointTwo = {x: this.canvasId.width/2, y: 0};
    const pointThree = {x: this.canvasId.width, y: 0};
    const pointFour = {x: this.canvasId.width, y: this.canvasId.height/2};
    const pointFive = {x: this.canvasId.width, y: this.canvasId.height};
    const pointSix = {x: this.canvasId.width/2, y: this.canvasId.height};
    const pointSeven = {x: 0, y: this.canvasId.height};
    const pointEight = {x: 0, y: this.canvasId.height/2};
    this.pointsCheck.push(pointOne);
    this.pointsCheck.push(pointTwo);
    this.pointsCheck.push(pointThree);
    this.pointsCheck.push(pointFour);
    this.pointsCheck.push(pointFive);
    this.pointsCheck.push(pointSix);
    this.pointsCheck.push(pointSeven);
    this.pointsCheck.push(pointEight);
    this.pointsCheck.push(pointOne);

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(0,0);
    this.canvasContext.lineTo(this.canvasId.width,this.canvasId.height);

    this.canvasContext.moveTo(this.canvasId.width,0);
    this.canvasContext.lineTo(0,this.canvasId.height);

    this.canvasContext.moveTo(this.canvasId.width/2,0);
    this.canvasContext.lineTo(this.canvasId.width/2,this.canvasId.height);

    this.canvasContext.moveTo(0,this.canvasId.width/2);
    this.canvasContext.lineTo(this.canvasId.width,this.canvasId.height/2);
    this.canvasContext.lineWidth=1;
    this.canvasContext.stroke();

    this.canvasContext.restore();     // 画完米字格后，将前面保存的canvas的设置恢复出来
    console.log('需要检查的点有：', this.pointsCheck);
  }

  // 画五角星
  drawStar() {
    this.pointsCheck = [];
    this.canvasContext.save();

    const r = 80;  // 小圆半径
    const R = 200;  // 大圆半径
    const x = 200;  // 中心点x坐标
    const y = 220;  // 中心点y坐标
    const rot = 0;  // 旋转角度

    this.canvasContext.beginPath();
    for (let i=0; i<5; i++) {
      const xOut = Math.cos((18+i*72-rot)/180*Math.PI)*R+x;
      const yOut = -Math.sin((18+i*72-rot)/180*Math.PI)*R+y;
      const xIn = Math.cos((54+i*72-rot)/180*Math.PI)*r+x;
      const yIn = -Math.sin((54+i*72-rot)/180*Math.PI)*r+y;
      this.canvasContext.lineTo(xOut,yOut);
      this.canvasContext.lineTo(xIn,yIn);

      this.pointsCheck.push({x: xOut, y: yOut});
      this.pointsCheck.push({x: xIn, y: yIn});
    }
    this.canvasContext.closePath();

    this.canvasContext.fillStyle = '#EA96C1';
    this.canvasContext.strokeStyle = 'blue';
    this.canvasContext.lineWidth = 3;
    this.canvasContext.fill();
    this.canvasContext.stroke();

    this.canvasContext.restore();
    console.log('drawStar需要检查的点有：', this.pointsCheck);
  }
}