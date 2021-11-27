import { Injectable } from '@angular/core';
import {APIService} from './api.service';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {
  englishDictData;

  constructor(private storage: Storage, private http: HttpClient) {
    this.getEnglishDict();
  }

  getEnglishDict() {
    if (!this.englishDictData) {
      this.http.get(APIService.englishDictData).subscribe(data => {
        if (data) {
          this.englishDictData = data;
        }
      });
    }
    return this.englishDictData;
  }

  getEnglishWord(name: string) {
    let databack;
    for (const one of this.englishDictData) {
      const id = one._id;
      if (id === name) {
        databack = one;
        break;
      }
    }
    return databack;
  }
}
