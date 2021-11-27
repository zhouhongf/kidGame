export interface SlideInterface {
    title: string;
    description: string;
    image: string;
}

export interface SearchItemInterface {
    id: string;
    title: string;
    description: string;
    url: string;
    createTime: number;
}

export interface SearchHistoryInterface {
    id: string;         // id就是searchTime
    keyword: string;
    itemsSelect: Array<SearchItemInterface>;
}


