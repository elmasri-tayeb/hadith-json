### إضافة شجرة الرواة لكل حديث

يمكننا تحديث هيكل البيانات ليشمل سلسلة الرواة بالشكل التالي:

```json
{
  "id": 1,
  "chapter": {
    "id": 1,
    "arabic": "كتاب بدء الوحي",
    "english": "Book of Revelation"
  },
  "narrators": {
    "chain": [
      {
        "name": {
          "arabic": "عمر بن الخطاب",
          "english": "Umar ibn Al-Khattab"
        },
        "title": {
          "arabic": "رضي الله عنه",
          "english": "may Allah be pleased with him"
        },
        "level": 1
      },
      {
        "name": {
          "arabic": "علقمة بن وقاص الليثي",
          "english": "Alqama bin Waqqas Al-Laithi"
        },
        "level": 2
      },
      {
        "name": {
          "arabic": "محمد بن إبراهيم التيمي",
          "english": "Muhammad bin Ibrahim At-Taimi"
        },
        "level": 3
      },
      {
        "name": {
          "arabic": "يحيى بن سعيد الأنصاري",
          "english": "Yahya bin Sa'id Al-Ansari"
        },
        "level": 4
      },
      {
        "name": {
          "arabic": "سفيان",
          "english": "Sufyan"
        },
        "level": 5
      },
      {
        "name": {
          "arabic": "الحميدي عبد الله بن الزبير",
          "english": "Al-Humaidi Abdullah bin Az-Zubair"
        },
        "level": 6
      }
    ],
    "type": "متصل", // نوع السند (متصل، منقطع، معنعن، الخ)
    "grade": "صحيح" // درجة السند
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

لتنفيذ هذا التحديث، نحتاج إلى:

1. تحديث هيكل البيانات في قاعدة البيانات
2. إضافة خوارزمية لاستخراج سلسلة الرواة من النص العربي
3. إضافة API endpoints جديدة للبحث حسب الراوي

### API Endpoints الجديدة المقترحة

1. البحث عن الأحاديث حسب الراوي:
```
GET /hadith/by-narrator/:narratorName
```

2. الحصول على قائمة الرواة:
```
GET /narrators
```

3. الحصول على شجرة الإسناد لحديث معين:
```
GET /hadith/:id/isnad
```

### مثال على استخدام شجرة الرواة

```bash
# الحصول على جميع أحاديث راوٍ معين
curl http://localhost:3000/hadith/by-narrator/عمر%20بن%20الخطاب

# الحصول على شجرة الإسناد لحديث معين
curl http://localhost:3000/hadith/1/isnad
```

### ملاحظات مهمة حول شجرة الرواة

1. يتم ترتيب الرواة من الأقدم (الصحابي) إلى الأحدث
2. كل راوٍ له مستوى في السند (level)
3. يمكن إضافة معلومات إضافية عن كل راوٍ مثل:
   - سنة الولادة والوفاة
   - الكنية واللقب
   - البلد
   - التلاميذ والشيوخ

### خطوات التنفيذ المقترحة

1. تحليل النص العربي لاستخراج سلسلة الرواة
2. إنشاء قاعدة بيانات للرواة
3. ربط الأحاديث بسلسلة الرواة
4. تحديث واجهة API
5. إضافة وثائق API الجديدة

هل تريد المتابعة مع تنفيذ هذه التحديثات؟