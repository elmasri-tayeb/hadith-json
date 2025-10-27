# دليل استخدام API - النقاط النهائية والأمثلة

## المقدمة
هذا الدليل يوضح كيفية استخدام واجهة برمجة التطبيقات (API) للحديث الشريف. كل نقطة نهاية موثقة مع أمثلة للطلبات والاستجابات.

## تنسيق الاستجابة العام
جميع الاستجابات تأتي بتنسيق JSON وتحتوي على:
- رمز الحالة HTTP (200 للنجاح، 404 للعنصر غير الموجود، 500 للخطأ في الخادم)
- بيانات الاستجابة أو رسالة الخطأ

### مثال للاستجابة الناجحة:
```json
{
    "success": true,
    "data": { ... }
}
```

### مثال للاستجابة في حالة الخطأ:
```json
{
    "error": "رسالة الخطأ",
    "details": "تفاصيل إضافية عن الخطأ (اختياري)"
}
```

## قائمة الكتب المتوفرة

### كتب الأربعين حديثاً
- الأربعون النووية (nawawi40)
- الأربعون القدسية (qudsi40)
- أربعين شاه ولي الله (shahwaliullah40)

### الكتب التسعة
- صحيح البخاري (bukhari)
- صحيح مسلم (muslim)
- سنن أبي داود (abudawud)
- سنن الترمذي (tirmidhi)
- سنن النسائي (nasai)
- سنن ابن ماجه (ibnmajah)
- موطأ مالك (malik)
- مسند أحمد (ahmed)
- سنن الدارمي (darimi)

### كتب أخرى
- الأدب المفرد (aladab_almufrad)
- بلوغ المرام (bulugh_almaram)
- مشكاة المصابيح (mishkat_almasabih)
- رياض الصالحين (riyad_assalihin)
- الشمائل المحمدية (shamail_muhammadiyah)

## نقاط نهاية API

### 1. البحث حسب الكتاب
```
GET /book/:category/:bookName
```
مثال للطلب:
```
http://localhost:3000/book/forties/nawawi40
http://localhost:3000/book/the_9_books/bukhari
```

مثال للاستجابة:
```json
{
    "id": 10,
    "metadata": {
        "id": 10,
        "arabic": {
            "title": "الأربعون النووية",
            "author": "الإمام يحيى بن شرف النووي",
            "introduction": "..."
        },
        "english": {
            "title": "The Forty Hadith of Imam Nawawi",
            "author": "Imam Yahya ibn Sharaf al-Nawawi",
            "introduction": "..."
        }
    },
    "hadiths": [
        {
            "id": 40944,
            "idInBook": 1,
            "chapterId": 0,
            "bookId": 10,
            "arabic": "...",
            "english": {
                "narrator": "...",
                "text": "..."
            }
        }
    ]
}

### 2. البحث حسب رقم الحديث
```
GET /hadith/:id
```
مثال للطلب:
```
http://localhost:3000/hadith/40944
```

مثال للاستجابة:
```json
{
    "id": 40944,
    "bookId": 10,
    "chapterId": 1,
    "book": {
        "arabic": "الأربعون النووية",
        "english": "The Forty Hadith of Imam Nawawi"
    },
    "chapter": {
        "arabic": "باب النية",
        "english": "Chapter: The Intention"
    },
    "text": {
        "arabic": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ ﷺ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        "english": "It is narrated on the authority of Umar ibn al-Khattab (may Allah be pleased with him) who said: I heard the Messenger of Allah (ﷺ) say: Actions are according to intentions, and everyone will get what was intended."
    },
    "grade": "صحيح",
    "gradeSource": "متفق عليه"
}
```
```
http://localhost:3000/hadith/40944
```

مثال للاستجابة:
```json
{
    "id": 40944,
    "idInBook": 1,
    "bookId": 10,
    "chapterId": 0,
    "arabic": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: \" إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ...",
    "english": {
        "narrator": "On the authority of Umar ibn Al-Khattab",
        "text": "Actions are but by intentions..."
    },
    "grade": {
        "value": "متفق عليه",
        "source": "رواه البخاري ومسلم"
    },
    "narrators": {
        "chain": [
            {
                "name": {
                    "arabic": "عمر بن الخطاب",
                    "english": "Umar ibn al-Khattab"
                },
                "level": 1
            }
        ]
    }
}

### 3. البحث حسب الراوي
```
GET /hadith/by-narrator/:narratorName
```
أمثلة للطلب:
```
http://localhost:3000/hadith/by-narrator/عمر%20بن%20الخطاب
http://localhost:3000/hadith/by-narrator/أبو%20هريرة
```

مثال للاستجابة:
```json
{
    "count": 2,
    "results": [
        {
            "id": 40944,
            "bookId": 10,
            "arabic": "...",
            "english": {
                "narrator": "On the authority of Umar ibn Al-Khattab",
                "text": "..."
            },
            "narrators": {
                "chain": [
                    {
                        "name": {
                            "arabic": "عمر بن الخطاب",
                            "english": "Umar ibn al-Khattab"
                        },
                        "level": 1
                    }
                ]
            }
        }
    ]
}

### 4. البحث حسب درجة الحديث
```
GET /hadith/by-grade/:grade
```
مثال للطلب:
```
http://localhost:3000/hadith/by-grade/صحيح
```

مثال للاستجابة:
```json
{
    "count": 1,
    "results": [
        {
            "id": 40944,
            "book": {
                "arabic": "الأربعون النووية",
                "english": "The Forty Hadith of Imam Nawawi"
            },
            "text": {
                "arabic": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ ﷺ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
                "english": "It is narrated on the authority of Umar ibn al-Khattab (may Allah be pleased with him) who said: I heard the Messenger of Allah (ﷺ) say: Actions are according to intentions"
            },
            "grade": "صحيح",
            "gradeSource": "متفق عليه"
        }
    ]
}
```
أمثلة للطلب:
```
http://localhost:3000/hadith/by-grade/صحيح
http://localhost:3000/hadith/by-grade/حسن
http://localhost:3000/hadith/by-grade/متفق%20عليه
```

مثال للاستجابة:
```json
{
    "count": 2,
    "results": [
        {
            "id": 40944,
            "bookId": 10,
            "arabic": "...",
            "english": {
                "narrator": "...",
                "text": "..."
            },
            "grade": {
                "value": "صحيح",
                "source": "رواه البخاري"
            },
            "narrators": {
                "chain": [...]
            }
        }
    ]
}

### 5. عرض شجرة الإسناد
```
GET /hadith/:id/isnad
```
مثال للطلب:
```
http://localhost:3000/hadith/40944/isnad
```

مثال للاستجابة:
```json
{
    "id": 40944,
    "book": {
        "arabic": "الأربعون النووية",
        "english": "The Forty Hadith of Imam Nawawi"
    },
    "grade": "متفق عليه",
    "gradeSource": "رواه البخاري ومسلم",
    "narrators": {
        "chain": [
            {
                "name": {
                    "arabic": "عمر بن الخطاب",
                    "english": "Umar ibn al-Khattab"
                },
                "title": {
                    "arabic": "أمير المؤمنين",
                    "english": "Commander of the Faithful"
                },
                "level": 1
            }
        ],
        "type": "متصل",
        "count": 1
    }
}

### 6. عرض المعلومات الكاملة للحديث
```
GET /hadith/:id/full
```
مثال للطلب:
```
http://localhost:3000/hadith/40944/full
```

مثال للاستجابة:
```json
{
    "id": 40944,
    "bookId": 10,
    "chapterId": 1,
    "book": {
        "arabic": "الأربعون النووية",
        "english": "The Forty Hadith of Imam Nawawi"
    },
    "chapter": {
        "arabic": "باب النية",
        "english": "Chapter: The Intention"
    },
    "text": {
        "arabic": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ ﷺ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        "english": "It is narrated on the authority of Umar ibn al-Khattab (may Allah be pleased with him) who said: I heard the Messenger of Allah (ﷺ) say: Actions are according to intentions, and everyone will get what was intended."
    },
    "grade": "صحيح",
    "gradeSource": "متفق عليه",
    "narrators": {
        "chain": [
            {
                "name": {
                    "arabic": "عمر بن الخطاب",
                    "english": "Umar ibn al-Khattab"
                },
                "title": {
                    "arabic": "أمير المؤمنين",
                    "english": "Commander of the Faithful"
                },
                "level": 1
            }
        ],
        "type": "متصل",
        "count": 1
    },
    "references": {
        "hadithInBooks": [
            {
                "book": "صحيح البخاري",
                "chapter": "كتاب بدء الوحي",
                "number": 1
            },
            {
                "book": "صحيح مسلم",
                "chapter": "كتاب الإمارة",
                "number": 1907
            }
        ]
    }
}
```
مثال:
```
http://localhost:3000/hadith/40944/full
```

## أمثلة على المخرجات

### مثال لمخرجات الحديث الكامل
```json
{
    "id": 40944,
    "book": {
        "id": 10,
        "name": {
            "arabic": "الأربعون النووية",
            "english": "The Forty Hadith of Imam Nawawi"
        },
        "author": {
            "arabic": "الإمام يحيى بن شرف النووي",
            "english": "Imam Yahya ibn Sharaf al-Nawawi"
        }
    },
    "grade": {
        "value": "متفق عليه",
        "source": "رواه البخاري ومسلم"
    },
    "text": {
        "arabic": {
            "full": "النص الكامل للحديث",
            "isnad": "سلسلة الإسناد",
            "matn": "متن الحديث"
        },
        "english": {
            "narrator": "الراوي باللغة الإنجليزية",
            "text": "النص الإنجليزي"
        }
    },
    "narrators": {
        "chain": ["الراوي الأول", "الراوي الثاني"],
        "count": 2
    }
}
```

### مثال لمخرجات شجرة الإسناد
```json
{
    "id": 40944,
    "book": {
        "arabic": "الأربعون النووية",
        "english": "The Forty Hadith of Imam Nawawi"
    },
    "grade": "متفق عليه",
    "narrators": {
        "chain": [
            {
                "name": {
                    "arabic": "عمر بن الخطاب",
                    "english": "Umar ibn al-Khattab"
                },
                "title": {
                    "arabic": "أمير المؤمنين",
                    "english": "Commander of the Faithful"
                },
                "level": 1
            }
        ]
    }
}
```

## ملاحظات مهمة
1. جميع المسارات تدعم UTF-8 للنصوص العربية
2. يجب ترميز النصوص العربية في URL (URL encode)
3. جميع المخرجات بتنسيق JSON
4. الطلبات غير الصالحة ستعيد رمز الحالة 404 أو 500 مع رسالة خطأ

### 7. البحث في متن الحديث
```
GET /search?q=:query
```
مثال للطلب:
```
http://localhost:3000/search?q=الأعمال بالنيات
```

مثال للاستجابة:
```json
{
    "results": [
        {
            "id": 40944,
            "book": {
                "arabic": "الأربعون النووية",
                "english": "The Forty Hadith of Imam Nawawi"
            },
            "chapter": {
                "arabic": "باب النية",
                "english": "Chapter: The Intention"
            },
            "text": {
                "arabic": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ ﷺ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
                "english": "It is narrated on the authority of Umar ibn al-Khattab (may Allah be pleased with him) who said: I heard the Messenger of Allah (ﷺ) say: Actions are according to intentions, and everyone will get what was intended."
            },
            "grade": "صحيح",
            "gradeSource": "متفق عليه",
            "score": 0.95
        }
    ],
    "count": 1
}
```

يمكن أيضاً تحديد الكتاب للبحث فيه:
```
http://localhost:3000/search?q=الأعمال بالنيات&book=nawawi40
```

## ملاحظات البحث والتصفية
- يمكن البحث عن الرواة باللغتين العربية والإنجليزية
- يمكن البحث عن الأحاديث حسب درجاتها المختلفة
- يمكن الحصول على معلومات تفصيلية عن أي حديث باستخدام نقطة النهاية /full