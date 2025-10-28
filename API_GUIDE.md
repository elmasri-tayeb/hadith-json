# دليل استخدام واجهة برمجة تطبيقات الأحاديث (Hadith API Guide)

## بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

هذا الدليل يشرح بالتفصيل كيفية استخدام واجهة برمجة التطبيقات (API) للوصول إلى قاعدة بيانات الأحاديث.

## كيفية البدء

1. قم بتثبيت المتطلبات:
```bash
npm install
```

2. قم بتشغيل الخادم:
```bash
npm run serve
```

سيعمل الخادم على العنوان: http://localhost:3000

## نقاط النهاية الجديدة للرواة والإسناد

### البحث عن الأحاديث حسب الراوي
```http
GET /search/narrator/:name
```

يمكنك البحث عن جميع الأحاديث التي يرويها راوٍ معين باستخدام اسمه بالعربية أو الإنجليزية.

مثال:
```http
GET /search/narrator/أبو هريرة
```

الاستجابة ستتضمن:
```json
[
  {
    "id": 123,
    "arabic": "...",
    "english": "...",
    "narratorChain": {
      "chain": [
        {
          "name": {
            "arabic": "أبو هريرة",
            "english": "Abu Huraira"
          },
          "level": 1
        }
      ],
      "type": "مرفوع"
    },
    "grade": "صحيح"
  }
]
```

### الحصول على شجرة الإسناد لحديث معين
```http
GET /hadith/:bookId/:hadithId/isnad
```

يمكنك الحصول على سلسلة الرواة الكاملة لحديث معين.

مثال:
```http
GET /hadith/1/7207/isnad
```

الاستجابة ستتضمن:
```json
{
  "hadithId": 7207,
  "narratorChain": {
    "chain": [
      {
        "name": {
          "arabic": "أبو هريرة",
          "english": "Abu Huraira"
        },
        "level": 1
      }
    ],
    "type": "مرفوع"
  },
  "grade": "صحيح"
}
```

## قائمة الكتب المتوفرة وروابطها

### الكتب التسعة (the_9_books)
1. صحيح البخاري
   - رابط الكتاب: `/book/the_9_books/bukhari.json`
   - رابط الأبواب: `/chapter/bukhari/{1-97}`

2. صحيح مسلم
   - رابط الكتاب: `/book/the_9_books/muslim.json`
   - رابط الأبواب: `/chapter/muslim/{1-56}`

3. سنن أبي داود
   - رابط الكتاب: `/book/the_9_books/abudawud.json`
   - رابط الأبواب: `/chapter/abudawud/{1-43}`

4. جامع الترمذي
   - رابط الكتاب: `/book/the_9_books/tirmidhi.json`
   - رابط الأبواب: `/chapter/tirmidhi/{1-49}`

5. سنن النسائي
   - رابط الكتاب: `/book/the_9_books/nasai.json`
   - رابط الأبواب: `/chapter/nasai/{1-52}`

6. سنن ابن ماجه
   - رابط الكتاب: `/book/the_9_books/ibnmajah.json`
   - رابط الأبواب: `/chapter/ibnmajah/{1-37}`

7. موطأ مالك
   - رابط الكتاب: `/book/the_9_books/malik.json`
   - رابط الأبواب: `/chapter/malik/{1-61}`

8. مسند أحمد
   - رابط الكتاب: `/book/the_9_books/ahmed.json`
   - رابط الأبواب: `/chapter/ahmed/{1-31}`
   - ملاحظة: الأبواب من 8 إلى 30 غير متوفرة في المصدر

9. سنن الدارمي
   - رابط الكتاب: `/book/the_9_books/darimi.json`
   - رابط الأبواب: `/chapter/darimi/{1-24}`

### كتب الأربعين (forties)
1. الأربعون النووية
   - رابط الكتاب: `/book/forties/nawawi40.json`
   - رابط الأحاديث: `/chapter/nawawi40/all`

2. الأربعون القدسية
   - رابط الكتاب: `/book/forties/qudsi40.json`
   - رابط الأحاديث: `/chapter/qudsi40/all`

3. أربعون الشاه ولي الله
   - رابط الكتاب: `/book/forties/shahwaliullah40.json`
   - رابط الأحاديث: `/chapter/shahwaliullah40/all`

### الكتب الأخرى (other_books)
1. رياض الصالحين
   - رابط الكتاب: `/book/other_books/riyad_assalihin.json`
   - رابط الأبواب: `/chapter/riyad_assalihin/{1-372}`

2. الأدب المفرد
   - رابط الكتاب: `/book/other_books/aladab_almufrad.json`
   - رابط الأبواب: `/chapter/aladab_almufrad/{1-57}`

3. بلوغ المرام
   - رابط الكتاب: `/book/other_books/bulugh_almaram.json`
   - رابط الأبواب: `/chapter/bulugh_almaram/{1-16}`

4. الشمائل المحمدية
   - رابط الكتاب: `/book/other_books/shamail_muhammadiyah.json`
   - رابط الأبواب: `/chapter/shamail_muhammadiyah/{1-56}`

5. مشكاة المصابيح
   - رابط الكتاب: `/book/other_books/mishkat_almasabih.json`
   - رابط الأبواب: `/chapter/mishkat_almasabih/{1-29}`

## أمثلة للاستخدام

### 1. الحصول على قائمة جميع الكتب
```bash
curl http://localhost:3000/books
```

### 2. الحصول على كتاب كامل
```bash
# صحيح البخاري
curl http://localhost:3000/book/the_9_books/bukhari.json

# الأربعون النووية
curl http://localhost:3000/book/forties/nawawi40.json
```

### 3. الحصول على باب محدد
```bash
# الباب الأول من صحيح البخاري
curl http://localhost:3000/chapter/bukhari/1

# الحديث الأول من الأربعين النووية
curl http://localhost:3000/chapter/nawawi40/1
```

## هيكل البيانات

### هيكل الكتاب الكامل
```json
{
  "metadata": {
    "length": 7563,
    "arabic": {
      "title": "صحيح البخاري",
      "author": "محمد بن إسماعيل البخاري",
      "introduction": "..."
    },
    "english": {
      "title": "Sahih al-Bukhari",
      "author": "Muhammad ibn Ismail al-Bukhari",
      "introduction": "..."
    }
  },
  "chapters": [...],
  "hadiths": [...]
}
```

### هيكل الباب
```json
{
  "metadata": {
    "length": 50,
    "arabic": {
      "title": "كتاب بدء الوحي",
      "introduction": "..."
    },
    "english": {
      "title": "Book of Revelation",
      "introduction": "..."
    }
  },
  "hadiths": [...]
}
```

### هيكل الحديث
```json
{
  "id": 1,
  "chapter": {
    "id": 1,
    "arabic": "كتاب بدء الوحي",
    "english": "Book of Revelation"
  },
  "arabic": {
    "text": "نص الحديث بالعربية",
    "grade": "درجة الحديث"
  },
  "english": {
    "text": "Hadith text in English",
    "grade": "Grade of hadith"
  }
}
```

## ملاحظات مهمة
1. جميع البيانات متوفرة باللغتين العربية والإنجليزية
2. الأرقام في روابط الأبواب تمثل عدد الأبواب المتوفرة في كل كتاب
3. في كتب الأربعين، استخدم "all" للحصول على جميع الأحاديث في ملف واحد
4. بعض الكتب قد تحتوي على مقدمة في بداية الكتاب
5. درجة الحديث متوفرة في معظم الكتب (إن وجدت في المصدر)

## الأخطاء الشائعة
1. التأكد من إضافة `.json` عند طلب الكتاب الكامل
2. التأكد من استخدام المسار الصحيح للكتاب (the_9_books, forties, other_books)
3. التأكد من استخدام رقم الباب ضمن النطاق المتاح لكل كتاب

## في حالة الخطأ
ستحصل على رسالة خطأ بالتنسيق التالي:
```json
{
  "error": "نوع الخطأ",
  "details": "تفاصيل الخطأ"
}
```