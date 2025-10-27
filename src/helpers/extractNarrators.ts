import { NarratorChain } from '../types/narrators';

/**
 * الكلمات المفتاحية التي تشير إلى بداية راوٍ جديد في السند
 */
const NARRATOR_INDICATORS = [
    'حدثنا',
    'أخبرنا',
    'حدثني',
    'أخبرني',
    'عن',
    'قال',
    'سمعت',
    'أن',
];

/**
 * الألقاب والكنى الشائعة للرواة
 */
const NARRATOR_TITLES = [
    'رضي الله عنه',
    'رضي الله عنها',
    'رحمه الله',
    'صلى الله عليه وسلم',
    'عليه السلام',
];

/**
 * استخراج سلسلة الرواة من نص الحديث العربي
 * @param arabicText نص الحديث العربي
 * @returns سلسلة الرواة مع مستوياتهم
 */
export function extractNarrators(arabicText: string): NarratorChain {
    // تقسيم النص إلى أجزاء بناءً على المؤشرات
    const parts = splitByIndicators(arabicText);
    
    // استخراج الرواة من كل جزء
    const narrators = parts.map((part, index) => {
        const name = extractNarratorName(part);
        const title = extractNarratorTitle(part);
        
        return {
            name: {
                arabic: name,
                english: translateNarratorName(name) // تحتاج إلى قاعدة بيانات للترجمة
            },
            title: title ? {
                arabic: title,
                english: translateTitle(title) // تحتاج إلى قاعدة بيانات للترجمة
            } : undefined,
            level: parts.length - index // عكس الترتيب لأن آخر راوٍ هو أول من في السند
        };
    }).filter(narrator => narrator.name.arabic); // إزالة أي نتائج فارغة

    // تحديد نوع السند
    const type = determineChainType(parts);

    return {
        chain: narrators,
        type: type,
        grade: 'يحتاج إلى تحديد' // تحتاج إلى قاعدة بيانات لدرجات الأسانيد
    };
}

/**
 * تقسيم النص إلى أجزاء بناءً على الكلمات المفتاحية
 */
function splitByIndicators(text: string): string[] {
    let parts: string[] = [text];
    
    for (const indicator of NARRATOR_INDICATORS) {
        parts = parts.flatMap(part => part.split(indicator));
    }
    
    return parts
        .map(part => part.trim())
        .filter(part => part.length > 0);
}

/**
 * استخراج اسم الراوي من جزء من النص
 */
function extractNarratorName(text: string): string {
    // إزالة الألقاب والكنى
    let name = text;
    for (const title of NARRATOR_TITLES) {
        name = name.replace(title, '');
    }
    
    // تنظيف النص
    return name.trim()
        .replace(/،/g, '') // إزالة الفواصل
        .replace(/\s+/g, ' '); // توحيد المسافات
}

/**
 * استخراج لقب الراوي من النص
 */
function extractNarratorTitle(text: string): string | undefined {
    for (const title of NARRATOR_TITLES) {
        if (text.includes(title)) {
            return title;
        }
    }
    return undefined;
}

/**
 * تحديد نوع السند (متصل، منقطع، معنعن، الخ)
 */
function determineChainType(parts: string[]): string {
    // تحتاج إلى منطق أكثر تعقيداً لتحديد نوع السند
    if (parts.some(part => part.includes('عن'))) {
        return 'معنعن';
    }
    if (parts.every((part, index) => index === 0 || NARRATOR_INDICATORS.some(indicator => part.includes(indicator)))) {
        return 'متصل';
    }
    return 'يحتاج إلى تحديد';
}

/**
 * ترجمة اسم الراوي إلى الإنجليزية
 */
function translateNarratorName(arabicName: string): string {
    // تحتاج إلى قاعدة بيانات للترجمة
    // هذه مجرد أمثلة
    const translations: Record<string, string> = {
        'عمر بن الخطاب': 'Umar ibn Al-Khattab',
        'أبو هريرة': 'Abu Hurairah',
        // إضافة المزيد من الترجمات
    };
    
    return translations[arabicName] || arabicName;
}

/**
 * ترجمة لقب الراوي إلى الإنجليزية
 */
function translateTitle(arabicTitle: string): string {
    const translations: Record<string, string> = {
        'رضي الله عنه': 'may Allah be pleased with him',
        'رضي الله عنها': 'may Allah be pleased with her',
        'صلى الله عليه وسلم': 'peace be upon him',
        // إضافة المزيد من الترجمات
    };
    
    return translations[arabicTitle] || arabicTitle;
}