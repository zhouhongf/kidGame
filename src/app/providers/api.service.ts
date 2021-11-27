import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  static mobile = 'MOBILE';
  static browse = 'BROWSE';
  static yes = 'YES';
  static no = 'NO';
  static pending = 'PENDING';

  static pageLength = 0;
  static pageIndex = 0;
  static pageSize = 10;

  static usernamePattern = '^0?[1|9][3|4|5|8|9][0-9]\\d{8}$';
  static passwordPattern = '^[a-zA-Z0-9_]{6,18}$';

  static linkPattern = '^http[s]?://\\S+$';
  static ChinesePattern = '[\u4E00-\u9FA5，、\.-]{2,}';
  static EnglishPattern = '[-a-zA-Z\\s,]{1,}';
  static NumberPattern = '[0-9]+';

  static englishDictData = 'assets/nlp/english_dict.json';

  // 接口基础地址
  static domain = 'http://www.jingrongbank.com:9005';

  static SHARED: any = {
    getWritingByTitle: '/shared/getWritingByTitle'
  };

  static SAVE_LOCAL: any = {
    deviceType: 'deviceType',
  };

  /**
   * 每次调用sequence加1
   */
  static getSequence = (() => {
    let sequence = 1;
    return () => {
      return ++sequence;
    };
  })();


  // 根据url获取文件类型
  static getFileType(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf('.') + 1, fileUrl.length).toLowerCase();
  }
  // 根据url获取文件名(包含文件类型)
  static getFileName(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.length).toLowerCase();
  }

  static getFileMimeType(fileType: string): string {
    let mimeType = '';
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }

}
