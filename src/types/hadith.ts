export type HadithGrade = 
    | 'صحيح' 
    | 'حسن'
    | 'ضعيف'
    | 'صحيح لغيره'
    | 'حسن لغيره'
    | 'ضعيف جداً'
    | 'موضوع'
    | 'مقبول'
    | 'متفق عليه'
    | 'غير معروف';

export interface Hadith {
    id: number;
    arabic: string;
    english: string;
    reference: {
        book: string;
        chapter?: string;
        number: number;
    };
    grade?: HadithGrade;
    narratorChain?: NarratorChain;
}
    };
    grade?: HadithGrade;
}