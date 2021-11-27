export const lessonTypeData = [
    {value: '英语'},
];

export interface VocabularyInterface {
    englishWord: string;
    chineseWord: string;
}

export const timeRange = [
    {name: '最近一星期', value: 7},
    {name: '最近一个月', value: 30},
    {name: '最近三个月', value: 90},
    {name: '最近六个月', value: 180},
    {name: '自定义日期', value: 0}
];

// 单项选择：针对单词，或句子的选择题
// 多项选择：针对单词中文释义，将单词中文意思中的英文去掉，并且将逗号、句号分割后的单词，进行选择
// 将一个单词中，随机去掉其中连续的1、2个字母后，进行填空
// 将一个句子中，随机去掉其中的1个词语后，进行填空
// 根据单词，翻译成中文
// 根据单词读音，填写英文
export const questionTypeList = [
    { value: '英译汉单选' },
    { value: '汉译英单选' },
    { value: '单词听写题' },
    { value: '单词填空题' },
];

export interface QuestionSingleSelectInterface {
    question: string;
    answerCorrect: string;
    answerConfuse: any;
    answerSelected: string;
}

export interface QuestionFillBlankInterface {
    question: string;
    answerCorrect: string;
    answerSelected: string;
}


export interface ExamJournalInterface {
    timeStart: number;
    timeEnd: number;
    timeOver: number;
    examType: string;
    questions: any;
    answersWrong: any;
}
