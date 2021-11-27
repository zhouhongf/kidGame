import {Injectable} from '@angular/core';
import {APIService} from './api.service';
import {HttpClient} from '@angular/common/http';
import {AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class BaseService {

    theDomain = APIService.domain;


    constructor(
        private platform: Platform,
        private http: HttpClient,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) {
    }

    isMobile(): boolean {
        const deviceType = localStorage.getItem(APIService.SAVE_LOCAL.deviceType);
        if (deviceType) {
            return deviceType === APIService.mobile;
        } else {
            return this.platform.is('mobile');
        }
    }
    // 对参数进行编码
    encode(params) {
        let str = '';
        if (params) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    async httpGet(url, params, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create({});
        if (loader) {
            await loading.present();
        }
        this.http.get(this.theDomain + url + this.encode(params)).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }

    async httpPost(url, params, body, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create();
        if (loader) {
            await loading.present();
        }
        this.http.post(this.theDomain + url + this.encode(params), body).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }


    async httpDelete(url, params, callback?, loader: boolean = false) {
        const loading = await this.loadingCtrl.create({});
        if (loader) {
            await loading.present();
        }
        this.http.delete(this.theDomain + url + this.encode(params)).subscribe(
            async data => {
                if (loader) {
                    await loading.dismiss();
                }
                callback(data == null || data['code'] === 9 ? '[]' : data);
            },
            async error => {
                if (loader) {
                    await loading.dismiss();
                }
                this.handleError(error);
            });
    }


    handleError(error: Response | any) {
        let msg = '';
        if (error.status === 400) {
            msg = '请求无效(code：404)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status === 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status === 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        console.log(error);
        if (msg !== '') {
            console.log(msg);
        }
    }

    async alert(message, callback?) {
        if (callback) {
            const alert = await this.alertCtrl.create({
                header: '提示',
                message: message,
                buttons: [{
                    text: '确定', handler: data => {
                        callback();
                    }
                }]
            });
            await alert.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: '提示',
                message: message,
                buttons: ['确定']
            });
            await alert.present();
        }
    }


    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({message: message, duration: 3000});
        toast.present().then(value => {
            return value;
        });
    }
}
