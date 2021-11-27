import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateLabel'
})
export class DateLabelPipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   return null;
  // }

  transform(record, recordIndex, records): any {
    if (recordIndex > 0) {
      const searchTimeCurrent = record.id;
      const searchTimePrevious = records[recordIndex - 1].id;

      const searchTimeCurrentDate = new Date(Number(searchTimeCurrent)).toLocaleDateString();
      const searchTimePreviousDate = new Date(Number(searchTimePrevious)).toLocaleDateString();

      if (searchTimeCurrentDate !== searchTimePreviousDate) {
        const words = searchTimeCurrentDate.split('/');
        return `${words[0]}年${words[1]}月${words[2]}日`;
      }
      return null;
    } else {
      const searchTimeCurrent = record.id;
      const searchTimeCurrentDate = new Date(Number(searchTimeCurrent)).toLocaleDateString();
      const words = searchTimeCurrentDate.split('/');
      return `${words[0]}年${words[1]}月${words[2]}日`;
    }
  }
}
