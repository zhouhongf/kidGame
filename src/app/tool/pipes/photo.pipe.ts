import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'photo'
})
export class PhotoPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
