import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import {APIService} from '../../../providers/api.service';


@Component({
    selector: 'app-shared-app',
    templateUrl: './shared-app.component.html',
    styleUrls: ['./shared-app.component.scss'],
})
export class SharedAppComponent implements OnInit {
    param: string;

    urlR = 'assets/icons/RONG.png';
    urlC = 'assets/icons/CHAT.png';
    urlE = 'assets/icons/ENGLISH.png';
    urlH = 'assets/icons/HOUSE.png';
    urlS = 'assets/icons/SEARCH.png';
    urlM = 'assets/icons/MORGAGE.png';

    progress = 0;
    isDownload = false;

    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(data => {
            this.param = data.get('param');
            if (this.param) {
                setTimeout(() => {this.goTo(this.param); }, 2000);
            }
        });
    }

    goTo(location: string) {
        document.getElementById(location).scrollIntoView();
    }

    async download(officialName) {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        const filenameSave = officialName + '.apk';
        this.http.get(APIService.domain + '/shared/getFile/' + officialName, {responseType: 'blob'}).subscribe(
            async data => {
                console.log('文件大小为：', data.size);
                if (data.size > 0) {
                    const theFile = new File([data], filenameSave, {type: 'application/octet-stream'});
                    const link = document.createElement('a');
                    link.setAttribute('href', window.URL.createObjectURL(theFile));
                    link.setAttribute('download', filenameSave);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                await loading.dismiss();
            },
            async err => {
                console.log('下载文件失败', err);
                await loading.dismiss();
            });
    }

    downloadFile(officialName: string) {
        const fileName = officialName + '.apk';
        const url = APIService.domain + '/shared/getFile/' + officialName;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'blob';
        xhr.addEventListener('loadstart', ev => {
            //  开始下载事件：下载进度条的显示
            this.isDownload = true;
        });
        xhr.addEventListener('progress', ev => {
            this.progress = Math.round(100.0 * ev.loaded / ev.total);  // 下载中事件：计算下载进度
            console.log(this.progress);
        });
        xhr.addEventListener('load', ev => {
            const blob = xhr.response;  // 下载完成事件：处理下载文件
            if (blob) {
                const theFile = new File([blob], fileName, {type: 'application/octet-stream'});
                const link = document.createElement('a');
                link.setAttribute('href', window.URL.createObjectURL(theFile));
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
        xhr.addEventListener('loadend', ev => {
            // 结束下载事件：下载进度条的关闭
            this.progress = 0;
            this.isDownload = false;
        });
        xhr.addEventListener('error', ev => {
            console.log(ev);
        });
        xhr.addEventListener('abort', ev => {});
        xhr.send();
    }
}
