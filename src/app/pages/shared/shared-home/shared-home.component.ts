import {Component, OnInit} from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';


@Component({
    selector: 'app-shared-home',
    templateUrl: './shared-home.component.html',
    styleUrls: ['./shared-home.component.scss'],
})
export class SharedHomeComponent implements OnInit {
    title: string;
    dataShow;

    constructor(private baseService: BaseService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(data => {
            this.title = data.get('title');
            this.getData();
        });
    }

    getData() {
      this.baseService.httpGet(APIService.SHARED.getWritingByTitle, {title: this.title}, data => {
        if (data.code === 0) {
          this.dataShow = data.data;
        } else {
          this.baseService.presentToast(data.msg);
        }
      });
    }

}
