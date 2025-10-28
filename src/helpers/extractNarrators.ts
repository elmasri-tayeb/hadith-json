import { NarratorChain, Narrator } from "../types/narrators";

const NARRATOR_INDICATORS = [
    "حدثنا",
    "أخبرنا",
    "حدثني",
    "أخبرني",
    "عن",
    "قال",
    "سمعت",
    "أن",
    "أنه",
];

const NARRATOR_TITLES = {
    companion: [
        "رضي الله عنه",
        "رضي الله عنها",
        "رضي الله عنهما"
    ],
    scholar: [
        "رحمه الله",
        "الإمام",
        "الحافظ",
        "الشيخ"
    ],
    prophet: [
        "صلى الله عليه وسلم",
        "عليه السلام",
        "النبي",
        "رسول الله"
    ],
    position: [
        "أمير المؤمنين",
        "القاضي",
        "المحدث"
    ]
};

const EXCLUDED_WORDS = [
    "صلى الله عليه وسلم",
    "يقول",
    "قال",
    "عن",
    "أن",
    "أنه"
];

function cleanText(text: string): string {
    return text
        .replace(/[^\u0600-\u06FF\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function findTitle(text: string): { title: string | undefined; type: string | undefined } {
    for (const [type, titles] of Object.entries(NARRATOR_TITLES)) {
        for (const title of titles) {
            if (text.includes(title)) {
                return { title, type };
            }
        }
    }
    return { title: undefined, type: undefined };
}

function extractNarratorName(segment: string): { name: string; title: string | undefined; type: string | undefined } {
    let cleanedText = segment;
    let title: string | undefined;
    let type: string | undefined;

    // إزالة الكلمات المستبعدة
    for (const word of EXCLUDED_WORDS) {
        cleanedText = cleanedText.replace(new RegExp(word, 'g'), '');
    }

    // البحث عن الألقاب
    const titleInfo = findTitle(cleanedText);
    if (titleInfo.title) {
        title = titleInfo.title;
        type = titleInfo.type;
        cleanedText = cleanedText.replace(titleInfo.title, '');
    }

    // تنظيف النص
    cleanedText = cleanedText
        .replace(/^(قال|حدثنا|أخبرنا|حدثني|أخبرني|عن|سمعت)\s+/, '')
        .replace(/\s+(قال|يقول|أنه)\s*$/, '')
        .trim();

    return { 
        name: cleanedText,
        title,
        type
    };
}

/**
 * ترجمة اللقب
 */
function translateTitle(arabicTitle: string): string {
    const titles: { [key: string]: string } = {
        "رضي الله عنه": "may Allah be pleased with him",
        "رضي الله عنها": "may Allah be pleased with her",
        "رضي الله عنهما": "may Allah be pleased with both of them",
        "رحمه الله": "may Allah have mercy on him",
        "صلى الله عليه وسلم": "peace be upon him",
        "عليه السلام": "peace be upon him",
        "أمير المؤمنين": "Commander of the Faithful",
        "الإمام": "The Imam",
        "الحافظ": "The Hafidh",
        "الشيخ": "The Sheikh",
        "القاضي": "The Judge",
        "المحدث": "The Muhaddith"
    };
    return titles[arabicTitle] || arabicTitle;
}

function buildNarratorTree(narrators: Narrator[]): NarratorChain {
    // عكس الترتيب ليكون النبي ﷺ في المستوى الأول
    const reversedNarrators = [...narrators].reverse();
    
    // تحديد المستويات
    const chain = reversedNarrators.map((narrator, index) => ({
        ...narrator,
        level: index + 1
    }));

    return {
        chain,
        type: chain.length > 1 ? 'متصل' : 'غير متصل',
        grade: chain.length > 0 ? 'مقبول' : 'يحتاج إلى تحديد'
    };
}

export function extractNarrators(arabicText: string): NarratorChain {
    try {
        // تقسيم النص عند مؤشرات الرواية
        const segments = arabicText.split(new RegExp(`\\s+(?:${NARRATOR_INDICATORS.join('|')})\\s+`));
        const narrators: Narrator[] = [];

        for (const segment of segments) {
            if (!segment || segment.length < 3) continue;

            const cleanSegment = cleanText(segment);
            const { name, title, type } = extractNarratorName(cleanSegment);

            // تجاهل الأسماء القصيرة جداً أو التي لا تحتوي على "بن" أو "أبو"
            if (name.length < 3 || (!name.includes('بن') && !name.includes('أبو') && !title)) {
                continue;
            }

            narrators.push({
                name: {
                    arabic: name,
                    english: name // TODO: إضافة ترجمة الأسماء لاحقاً
                },
                title: title ? {
                    arabic: title,
                    english: translateTitle(title)
                } : undefined,
                level: 0, // سيتم تحديثه في buildNarratorTree
                type: type || 'راوي'
            });
        }

        // بناء شجرة الرواة مع تحديد المستويات بشكل صحيح
        return buildNarratorTree(narrators);
    } catch (error) {
        console.error('Error extracting narrators:', error);
        return {
            chain: [],
            type: 'غير معروف',
            grade: 'يحتاج إلى تحديد'
        };
    }
}
