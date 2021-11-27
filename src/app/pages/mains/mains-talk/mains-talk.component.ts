import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../../providers/base.service";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import {TextToSpeech} from "@ionic-native/text-to-speech/ngx";
import {SpeechRecognition} from "@ionic-native/speech-recognition/ngx";


@Component({
    selector: 'app-mains-talk',
    templateUrl: './mains-talk.component.html',
    styleUrls: ['./mains-talk.component.scss'],
})
export class MainsTalkComponent implements OnInit, OnDestroy {
    isMobile;
    title;

    messageContent;

    canvasId: any;
    canvasContext: any;
    // canvas的大小设置
    canvasObj = {canvasWidth: 800, canvasHeight: 800};
    bgColor = '#00f';
    colorRight = '#0f0';
    colorWrong = '#f00';

    lineWidth = 10;             // 画笔的大小
    isMouseDown = false;
    lastLoc = {x: 0, y: 0};   // 初始位置值
    lastTimestamp;

    pointsCheck = [];
    pointsMatch = [];
    shapeRatio = 1;

    targetShape = {
        r: 10,
        color: 'gold',
        differ: 20,
        item: [
            {
                p: [{x: 410, y: 400}, {x: 600, y: 530}, {x: 160, y: 460}, {x: 410, y: 620}],
                question: ['我在干什么？', '我的衣服是什么颜色？', '我手里拿的是什么？', '这是什么？'],
                answer: ['吃饭', '绿色', '筷子', '碗'],
                description: '点击图中小黄点回答问题',
                color: 'royalblue',
                image: 'url(assets/images/edu/talkOne.jpg)',
            },
            {
                p: [{x: 460, y: 250}, {x: 580, y: 500}, {x: 410, y: 620}],
                question: ['我头上戴了什么？', '我的衣服是什么颜色？', '我在干什么？'],
                answer: ['眼镜', '蓝色', '写字'],
                description: '这是题目要求和说明2',
                color: 'royalblue',
                image: 'url(assets/images/edu/talkTwo.jpg)',
            },
            {
                p: [{x: 470, y: 350}, {x: 270, y: 600}, {x: 450, y: 620}],
                question: ['我的衣服是什么颜色？', '我在干什么？', '雪是什么颜色的？'],
                answer: ['蓝色', '滑雪', '白色'],
                description: '这是题目要求和说明3',
                color: 'lightgray',
                image: 'url(assets/images/edu/talkThree.jpg)',
            },
            {
                p: [{x: 518, y: 570}, {x: 400, y: 440}, {x: 420, y: 350}],
                question: ['我在干什么？', '我是男生还是女生？', '我的衣服是什么颜色的？'],
                answer: ['跑步', '女生', '橙色'],
                description: '这是题目要求和说明4',
                color: 'royalblue',
                image: 'url(assets/images/edu/talkFour.jpg)',
            },
        ],
    }
    currentImage;
    currentQuestion;
    currentAnswer;
    currentPoint;
    currentIndex = 0;
    currentAnswerList = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private baseService: BaseService,
        private nativeAudio: NativeAudio,
        private tts: TextToSpeech,
        private speechRecognition: SpeechRecognition,
    ) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        console.log('------------- 执行ngOnInit ---------------')
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        console.log('窗口宽和高：', windowWidth, windowHeight)
        this.shapeRatio = windowWidth / this.canvasObj.canvasWidth;
        this.canvasObj.canvasWidth = windowWidth;
        this.canvasObj.canvasHeight = Math.min(this.canvasObj.canvasHeight, windowHeight);

        this.route.paramMap.subscribe(data => {
            this.title = data.get('param');

            this.canvasId = document.getElementById('canvasTalk');
            this.canvasContext = this.canvasId.getContext('2d');
            this.canvasId.width = this.canvasObj.canvasWidth;
            this.canvasId.height = this.canvasObj.canvasHeight;
            this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);

            this.pointsMatch = [];
            this.currentQuestion = undefined;
            this.currentAnswer = undefined;
            this.currentPoint = undefined;
            this.currentAnswerList = [];
            this.currentIndex = 0;
            this.currentImage = this.targetShape.item[this.currentIndex].image;
            this.drawCanvas();
            this.drawShape();
        });
    }

    ngOnDestroy() {
        console.log('------------- 执行ngOnDestroy ---------------')
        this.doClear();
    }

    doClear() {
        this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
        this.pointsCheck = [];
        this.pointsMatch = [];
        this.currentQuestion = undefined;
        this.currentAnswer = undefined;
        this.currentPoint = undefined;
        this.currentIndex = 0;
        this.currentAnswerList = [];
    }


    goBack() {
        if (this.currentIndex === 0) {
            this.router.navigate(['/mains/menu', {param: '看图对话'}]).then(() => {
                this.doClear();
            });
        } else {
            this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
            if (this.currentIndex > 0) {
                this.currentIndex = this.currentIndex - 1;
            }
            this.pointsMatch = [];
            this.currentQuestion = undefined;
            this.currentAnswer = undefined;
            this.currentPoint = undefined;
            this.currentImage = this.targetShape.item[this.currentIndex].image;
            this.drawCanvas();
            this.drawShape();
        }
    }

    goForward() {
        if (this.currentIndex < this.targetShape.item.length - 1) {
            this.canvasContext.clearRect(0, 0, this.canvasId.width, this.canvasId.height);
            this.currentIndex += 1;
            this.pointsMatch = [];
            this.currentQuestion = undefined;
            this.currentAnswer = undefined;
            this.currentPoint = undefined;
            this.currentImage = this.targetShape.item[this.currentIndex].image;
            this.drawCanvas();
            this.drawShape();
        } else {
            this.baseService.alert('已经是最后一页啦!');
        }

    }

    beginStroke(point) {
        this.isMouseDown = true;
        this.lastLoc = this.windowToCanvas(point.x, point.y);
        this.lastTimestamp = new Date().getTime();
    }

    endStroke() {
        this.isMouseDown = false;
        console.log('=========== 完成的点是：', this.pointsMatch);
    }

    moveStroke(point) {
        const curLoc = this.windowToCanvas(point.x, point.y);  // 获得当前坐标
        const curTimestamp = new Date().getTime();              // 当前时间
        this.lastLoc = curLoc;
        this.lastTimestamp = curTimestamp;

        // this.canvasContext.beginPath();
        // this.canvasContext.moveTo(this.lastLoc.x, this.lastLoc.y);
        // this.canvasContext.lineTo(curLoc.x, curLoc.y);
        // this.canvasContext.strokeStyle = this.bgColor;
        // this.canvasContext.lineCap = 'round'
        // this.canvasContext.lineJoin = 'round'
        // this.canvasContext.stroke();
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
     * 求两点之间距离
     */
    calcDistance(loc1, loc2) {
        return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
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
        if (this.pointsMatch.length > 0 && this.pointsMatch.length === this.pointsCheck.length) {
            this.isMouseDown = false;
            this.goForward();
        } else {
            const pointCurrentStr = pointCurrent.x + '=' + pointCurrent.y;
            console.log('选择的点是：', pointCurrentStr);
            for (let i = 0; i < this.pointsCheck.length; i++) {
                const point = this.pointsCheck[i];
                const pointCheckList = point.split('=')
                const pointCheck = {x: Number(pointCheckList[0]), y: Number(pointCheckList[1])}
                const pointDistance = this.calcDistance(pointCurrent, pointCheck);
                if (pointDistance < differenceRange) {
                    console.log('在差距内的点是：', pointCheck);
                    if (this.pointsMatch.indexOf(point) === -1) {
                        this.currentQuestion = this.targetShape.item[this.currentIndex].question[i];
                        this.currentAnswer = this.targetShape.item[this.currentIndex].answer[i];
                        this.currentPoint = point;

                        this.makeExam(this.currentQuestion, this.currentAnswer);
                    }
                }
            }
        }
    }

    makeExam(question, answer) {
        this.readMessage(question);
    }

    sendMessage() {
        if (this.messageContent) {
            console.log('已发送消息：', this.messageContent);
            console.log('答案是：', this.currentAnswer);
            this.messageContent = this.messageContent.trim();
            const pattern = new RegExp(this.messageContent, 'i');
            const res = pattern.test(this.currentAnswer);
            if (res) {
                this.pointsMatch.push(this.currentPoint);
                this.readMessage('你真棒！');
                this.drawAnswerRight(this.currentPoint);
                this.currentPoint = undefined;
            } else {
                this.readMessage('不对');
            }
            this.messageContent = undefined;
        }
    }

    drawAnswerRight(pointStr) {
        this.canvasContext.save();

        const pointCheckList = pointStr.split('=')
        const point = {x: Number(pointCheckList[0]), y: Number(pointCheckList[1])}

        this.canvasContext.beginPath();
        const radius = this.targetShape.r;
        this.canvasContext.shadowOffsetX = 5;
        this.canvasContext.shadowOffsetY = 5;
        this.canvasContext.shadowColor = 'rgba(100, 100, 100, 0.5)';
        this.canvasContext.shadowBlur = 7.5;
        this.canvasContext.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
        this.canvasContext.closePath();
        this.canvasContext.fillStyle = this.colorRight;
        this.canvasContext.fill();

        this.canvasContext.restore();
    }


    readMessage(content) {
        if (this.isMobile) {
            this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
                .then(() => console.log('Success'))
                .catch((reason: any) => console.log(reason));
        } else {
            this.baseService.presentToast(content);
        }
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
                this.messageContent = matches[0];
                // this.ionTextarea.setFocus();
            },
            (onerror) => alert('error:' + onerror)
        );
    }


    drawShape() {
        this.pointsCheck = [];
        this.currentAnswerList = this.targetShape.item[this.currentIndex].answer;

        const points = this.targetShape.item[this.currentIndex].p;
        const radius = this.targetShape.r;
        this.canvasContext.shadowOffsetX = 5;
        this.canvasContext.shadowOffsetY = 5;
        this.canvasContext.shadowColor = 'rgba(100, 100, 100, 0.5)';
        this.canvasContext.shadowBlur = 7.5;
        for (const point of points) {
            this.canvasContext.beginPath();
            const xNeed = point.x * this.shapeRatio;
            const yNeed = point.y;
            this.canvasContext.arc(xNeed, yNeed, radius, 0, Math.PI * 2, true);
            this.canvasContext.closePath();
            this.canvasContext.fillStyle = this.targetShape.color;
            this.canvasContext.fill();

            const one = xNeed + '=' + yNeed;
            this.pointsCheck.push(one);
        }
        console.log('需要检查的点有：', this.pointsCheck);
    }

}
