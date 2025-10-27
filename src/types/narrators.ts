export interface Narrator {
    name: {
        arabic: string;
        english: string;
    };
    title?: {
        arabic: string;
        english: string;
    };
    level: number;
}

export interface NarratorChain {
    chain: Narrator[];
    type: string;
    grade: string;
}

export interface HadithWithNarrators {
    id: number;
    chapter: {
        id: number;
        arabic: string;
        english: string;
    };
    narrators: NarratorChain;
    arabic: {
        text: string;
        grade: string;
    };
    english: {
        text: string;
        grade: string;
    };
}