import {MatPaginatorIntl} from '@angular/material/paginator';


export function myPaginator() {
    const p = new MatPaginatorIntl();
    p.firstPageLabel = '第一页';
    p.lastPageLabel = '最后一页';
    p.itemsPerPageLabel = '每页数量';
    p.nextPageLabel = '下一页';
    p.previousPageLabel = '上一页';
    p.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return '0 of ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return '第' + (startIndex + 1) + ' - ' + endIndex + '条，共 ' + length + '条';
    };
    return p;
}
