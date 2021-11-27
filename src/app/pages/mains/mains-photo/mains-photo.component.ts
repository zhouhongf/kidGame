import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../../providers/base.service";
import {TextToSpeech} from "@ionic-native/text-to-speech/ngx";
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import {NativeAudio} from "@ionic-native/native-audio/ngx";

@Component({
    selector: 'app-mains-photo',
    templateUrl: './mains-photo.component.html',
    styleUrls: ['./mains-photo.component.scss'],
})
export class MainsPhotoComponent implements OnInit, OnDestroy {
    photoUse = 'assets/images/edu/headerChild.png';

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
    shapeRatio = 1;

    targetShape = {
        elements: [
            {name: '左边眼睛', p: {x: 140, y: 200}},
            {name: '右边眼睛', p: {x: 250, y: 200}},
            {name: '左边眉毛', p: {x: 144, y: 178}},
            {name: '右边眉毛', p: {x: 244, y: 178}},
            {name: '左边耳朵', p: {x: 78, y: 207}},
            {name: '右边耳朵', p: {x: 320, y: 207}},
            {name: '嘴巴', p: {x: 194, y: 247}},
            {name: '鼻子', p: {x: 194, y: 214}},
        ],
        color: 'rgba(255,0,0,0.25)',
        differ: 20,
    }
    targetPart = {};
    correctAnswers = [];

    // 收到消息 声音通知
    onSuccess: any;
    onError: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private baseService: BaseService,
        private nativeAudio: NativeAudio,
        private tts: TextToSpeech,
        private speechRecognition: SpeechRecognition
        ) {
        this.nativeAudio.preloadSimple('uniqueId1', 'assets/sounds/bubble.mp3').then(this.onSuccess, this.onError);
    }

    ngOnInit() {
        console.log('------------- 执行ngOnInit ---------------')
        const windowWidth = window.innerWidth - 20;
        const windowHeight = window.innerHeight;
        console.log('窗口宽和高：', windowWidth, windowHeight)
        if (windowWidth < this.canvasObj.canvasWidth) {
            this.shapeRatio = windowWidth / this.canvasObj.canvasWidth;
        }

        this.canvasId = document.getElementById('canvas');
        this.canvasContext = this.canvasId.getContext('2d');
        this.canvasId.width = Math.min(this.canvasObj.canvasWidth, windowWidth);
        this.canvasId.height = this.canvasId.width;
        this.drawCanvas();
        this.drawPhoto();
    }

    ngOnDestroy() {
        console.log('------------- 执行ngOnDestroy ---------------')
        this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
        this.pointsCheck = [];
    }

    // 橡皮擦：canvas的高度及宽度重置
    getItem(name: string) {
        this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
        this.drawCanvas();
        this.drawPhoto();
        for (const one of this.pointsCheck) {
            if (name === one['name']) {
                this.targetPart = one;
                break;
            }
        }
        this.readMessage(name);
    }

    beginStroke(point) {
        this.isMouseDown = true;
        this.lastLoc = this.windowToCanvas(point.x, point.y);
        this.lastTimestamp = new Date().getTime();
    }

    endStroke() {
        this.isMouseDown = false;
    }

    moveStroke(point) {
        const curLoc = this.windowToCanvas(point.x, point.y);  // 获得当前坐标
        const curTimestamp = new Date().getTime();              // 当前时间
        // const s = this.calcDistance(curLoc, this.lastLoc);      // 获得运笔距离
        // const t = curTimestamp - this.lastTimestamp;            // 运笔时间
        // const speed = this.calcLineWidth(t, s);
        // this.canvasContext.lineWidth = speed;
        // this.canvasContext.beginPath();
        // this.canvasContext.moveTo(this.lastLoc.x, this.lastLoc.y);
        // this.canvasContext.lineTo(curLoc.x, curLoc.y);
        // this.canvasContext.strokeStyle = this.bgColor;
        // this.canvasContext.lineCap = 'round'
        // this.canvasContext.lineJoin = 'round'
        // this.canvasContext.stroke();
        this.lastLoc = curLoc;
        this.lastTimestamp = curTimestamp;
        // this.drawSpeed = speed;
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
            this.drawResultWrong();
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
            this.drawResultWrong();
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
        const pointCurrent = {x: Math.round(x - ctxbox.left), y: Math.round(y - ctxbox.top)};
        console.log('canvas坐标', pointCurrent.x, pointCurrent.y);
        this.checkPointMatch(pointCurrent);
        return pointCurrent;
    }

    checkPointMatch(pointCurrent) {
        const differenceRange = this.targetShape.differ;
        const pointDistance = this.calcDistance(pointCurrent, this.targetPart['p']);
        console.log('差距是：', pointDistance);
        if (pointDistance < differenceRange) {
            this.endStroke();
            const name = this.targetPart['name']
            if (this.correctAnswers.indexOf(name) === -1) {
                this.correctAnswers.push(this.targetPart['name']);
                this.baseService.presentToast('你答对了！');
                this.readMessage('你答对了！');
            }
        }
    }


    /**
     * 求两点之间距离
     */
    calcDistance(loc1, loc2) {
        return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
    }

    /**
     * 求速度
     */
    calcLineWidth(t, s) {
        const v = s / t;
        let resultLineWidth;
        if (v <= 0.1) {
            resultLineWidth = 30;
        } else if (v >= 10) {
            resultLineWidth = 1;
        } else {
            resultLineWidth = 30 - (v - 0.1) / (10 - 0.1) * (30 - 1);
        }
        if (this.lineWidth === -1) {
            return resultLineWidth;
        }
        return this.lineWidth * 2 / 3 + resultLineWidth * 1 / 3;
    }

    drawResultWrong() {
        const name = this.targetPart['name']
        if (name) {
            if (this.correctAnswers.indexOf(name) === -1) {
                this.baseService.presentToast('你答错了！')
                this.nativeAudio.play('uniqueId1').then(this.onSuccess, this.onError);
            }
        }
    }

    drawPhoto() {
        this.canvasContext.save();
        const image = new Image();
        image.src = this.photoUse;
        const width = Math.min(window.innerWidth, this.canvasObj.canvasWidth);
        const height = Math.min(window.innerHeight, this.canvasObj.canvasHeight);
        image.onload = () => {
            this.canvasContext.drawImage(image, 0, 0, width, height);
            const imageData = this.canvasContext.getImageData(0, 0, width, width);
            this.canvasContext.putImageData(imageData, 0, 0);
        }
        this.pointsCheck = this.targetShape.elements;
    }


    readMessage(content) {
        this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }

    startListen() {
        const options = {
            language: 'zh-CN',
            matches: 5,
            prompt: '',
            showPopup: true,
            showPartial: false
        };
        this.speechRecognition.startListening(options).subscribe(
            (matches: string[]) => {
                console.log(matches[0]);
            },
            (onerror) => alert('error:' + onerror)
        );
    }
}
