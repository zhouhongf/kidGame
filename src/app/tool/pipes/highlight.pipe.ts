import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any): any {
    if (value) {
      const valueNew = value.replace(/<strong>/g, '<strong style="color: crimson; font-weight: normal">');
      return this.sanitizer.bypassSecurityTrustHtml(valueNew);
    }
  }

}
