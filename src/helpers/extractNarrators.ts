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

const NARRATOR_TITLES = [
    "رضي الله عنه",
    "رضي الله عنها",
    "رضي الله عنهما",
    "رحمه الله",
    "صلى الله عليه وسلم",
    "عليه السلام",
    "أمير المؤمنين",
];

function cleanText(text: string): string {
    return text.replace(/[^\u0600-\u06FF\s]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
}

function translateTitle(arabicTitle: string): string {
    const titles: { [key: string]: string } = {
        "رضي الله عنه": "may Allah be pleased with him",
        "رضي الله عنها": "may Allah be pleased with her",
        "رضي الله عنهما": "may Allah be pleased with both of them",
        "رحمه الله": "may Allah have mercy on him",
        "صلى الله عليه وسلم": "peace be upon him",
        "عليه السلام": "peace be upon him",
        "أمير المؤمنين": "Commander of the Faithful"
    };
    return titles[arabicTitle] || arabicTitle;
}

function translateNarratorName(arabicName: string): string {
    return arabicName;
}

export function extractNarrators(arabicText: string): NarratorChain {
    try {
        const segments = arabicText.split(/\s+(?:حدثنا|أخبرنا|حدثني|أخبرني|عن|قال|سمعت|أن)\s+/);
        const narrators: Narrator[] = [];
        
        for (let i = 0; i < segments.length; i++) {
            const segment = cleanText(segments[i]);
            
            if (!segment || segment.length < 3) continue;
            
            let name = segment;
            let title: string | undefined;
            
            for (const t of NARRATOR_TITLES) {
                if (segment.includes(t)) {
                    name = segment.replace(t, "").trim();
                    title = t;
                    break;
                }
            }
            
            name = name.replace(/^(قال|حدثنا|أخبرنا|حدثني|أخبرني|عن|سمعت)\s+/, "")
                      .replace(/\s+(قال|يقول|أنه)\s*$/, "")
                      .trim();
            
            if (name && (name.includes("بن") || name.includes("أبو") || title)) {
                narrators.push({
                    name: {
                        arabic: name,
                        english: translateNarratorName(name)
                    },
                    title: title ? {
                        arabic: title,
                        english: translateTitle(title)
                    } : undefined,
                    level: narrators.length + 1
                });
            }
        }

        return {
            chain: narrators,
            type: narrators.length > 0 ? "متصل" : "غير متصل",
            grade: "يحتاج إلى تحديد"
        };
    } catch (error) {
        console.error("Error extracting narrators:", error);
        return {
            chain: [],
            type: "غير معروف",
            grade: "يحتاج إلى تحديد"
        };
    }
}
