export interface HadithGrade {
    grade: string;
    source?: string;
}

export function extractGrade(arabic: string, english: string): HadithGrade | undefined {
    // Common grade patterns in Arabic text
    const gradePatterns = {
        'صحيح': [/حديث صحيح/, /صحيح$/i, /وقال.*صحيح/, /رواه.*صحيح/],
        'حسن': [/حديث حسن/, /حسن$/i, /وقال.*حسن/, /رواه.*حسن/],
        'حسن صحيح': [/حديث حسن صحيح/, /حسن صحيح$/i, /وقال.*حسن صحيح/, /رواه.*حسن صحيح/],
        'ضعيف': [/حديث ضعيف/, /ضعيف$/i, /وقال.*ضعيف/, /رواه.*ضعيف/],
        'متفق عليه': [/متفق عليه/, /رواه البخاري ومسلم/],
        'صحيح البخاري': [/رواه البخاري/, /في صحيح البخاري/],
        'صحيح مسلم': [/رواه مسلم/, /في صحيح مسلم/],
    };

    // Check for grade patterns in Arabic text
    for (const [grade, patterns] of Object.entries(gradePatterns)) {
        for (const pattern of patterns) {
            if (pattern.test(arabic)) {
                // Find the source by looking for رواه
                const sourceMatch = arabic.match(/رواه ([\u0600-\u06FF\s]+)/);
                return {
                    grade,
                    source: sourceMatch ? sourceMatch[1].trim() : undefined
                };
            }
        }
    }

    // Also check English text for grade mentions
    const englishGradePatterns = {
        'صحيح': [/saheeh/i, /authentic/i],
        'حسن': [/hasan/i, /good/i],
        'حسن صحيح': [/hasan saheeh/i, /good and authentic/i],
        'ضعيف': [/da'if/i, /weak/i],
        'متفق عليه': [/agreed upon/i, /bukhari and muslim/i],
    };

    for (const [grade, patterns] of Object.entries(englishGradePatterns)) {
        for (const pattern of patterns) {
            if (pattern.test(english)) {
                return {
                    grade,
                    source: undefined
                };
            }
        }
    }

    return undefined;
}