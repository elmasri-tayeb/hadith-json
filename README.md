# Hadith-json Database [1.2.0]

Hadith is the second source of Islamic law after the Quran. It is the sayings and actions of Prophet Muhammed (PBUH).

An extensive JSON-formatted database is available, containing the Hadiths - Prophet Muhammed's (PBUH) sayings and actions - in both Arabic and English. The database encompasses 17 books of Hadiths.

قاعدة بيانات شاملة بصيغة JSON، تحتوي على الأحاديث النبوية الشريفة باللغتين العربية والإنجليزية. تشمل القاعدة 17 كتاباً من كتب السنة النبوية.

## Hadiths Count:

-  Total Hadiths: 50,884 Hadiths.

## Books included:

1. Sahih al-Bukhari صحيح البخاري
1. Sahih Muslim صحيح مسلم
1. Sunan Abi Dawud سنن أبي داود
1. Jami` at-Tirmidhi جامع الترمذي
1. Sunan an-Nasa'i سنن النسائي
1. Sunan Ibn Majah سنن ابن ماجه
1. Muwatta Malik موطأ مالك
1. Musnad Ahmad مسند أحمد
1. Sunan ad-Darimi سنن الدارمي
1. Riyad as-Salihin رياض الصالحين
1. Shamail al-Muhammadiyah الشمائل المحمدية
1. Bulugh al-Maram بلوغ المرام
1. Al-Adab Al-Mufrad الأدب المفرد
1. Mishkat al-Masabih مشكاة المصابيح
1. The Forty Hadith of al-Imam an-Nawawi الأربعون النووية
1. The Forty Hadith Qudsi الأربعون القدسية
1. The Forty Hadith of Shah Waliullah أربعون الشاه ولي الله

## Stack:

-  Node.js
-  TypeScript
-  Cheerio.js
-  Axios
-  cli-progress

## Data Source:

The data was scrapped from [Sunnah.com](https://sunnah.com/), and was converted to JSON format using a custom script. All scripts are available in the `src` folder.

## واجهة برمجة التطبيقات (API)

### كيفية البدء

1. قم بتثبيت المتطلبات:
```bash
npm install
```

2. قم بتشغيل الخادم:
```bash
npm run serve
```

الخادم سيعمل على المنفذ 3000: http://localhost:3000

### نقاط النهاية API Endpoints

#### 1. الصفحة الرئيسية
- **الرابط**: `GET /`
- **الوصف**: يعرض معلومات عامة عن الAPI ونقاط النهاية المتاحة
- **مثال**: http://localhost:3000/

#### 2. قائمة الكتب
- **الرابط**: `GET /books`
- **الوصف**: يعرض قائمة بجميع الكتب المتاحة
- **مثال**: http://localhost:3000/books
- **مثال للاستجابة**:
```json
[
  {
    "name": "Sahih al-Bukhari",
    "arabicName": "صحيح البخاري",
    "author": "Muhammad ibn Ismail al-Bukhari",
    "arabicAuthor": "محمد بن إسماعيل البخاري",
    "path": "the_9_books/bukhari"
  }
]
```

#### 3. الحصول على كتاب محدد
- **الرابط**: `GET /book/:bookPath`
- **الوصف**: يعرض محتوى كتاب كامل
- **المعاملات**:
  - `bookPath`: مسار الكتاب (يمكن الحصول عليه من نقطة النهاية /books)
- **أمثلة**:
  - صحيح البخاري: http://localhost:3000/book/the_9_books/bukhari.json
  - الأربعون النووية: http://localhost:3000/book/forties/nawawi40.json

#### 4. الحصول على باب محدد
- **الرابط**: `GET /chapter/:bookName/:chapterNumber`
- **الوصف**: يعرض محتوى باب محدد من كتاب
- **المعاملات**:
  - `bookName`: اسم الكتاب (مثل bukhari, muslim, nawawi40)
  - `chapterNumber`: رقم الباب
- **أمثلة**:
  - الباب الأول من صحيح البخاري: http://localhost:3000/chapter/bukhari/1
  - الحديث الأول من الأربعين النووية: http://localhost:3000/chapter/nawawi40/1

يتم تحديد فئة الكتاب (الكتب التسعة، الأربعينات، الكتب الأخرى) تلقائياً حسب اسم الكتاب.

### أمثلة للاستخدام

#### الحصول على حديث محدد من الأربعين النووية
```bash
curl http://localhost:3000/chapter/nawawi40/1
```

#### الحصول على الباب الأول من صحيح البخاري
```bash
curl http://localhost:3000/chapter/bukhari/1
```

### هيكل البيانات
البيانات متوفرة بصيغتين:

1. حسب الكتاب: الأحاديث مجمعة حسب الكتاب في المجلد [`db/by_book`](./db/by_book)
2. حسب الباب: الأحاديث مجمعة حسب الباب في المجلد [`db/by_chapter`](./db/by_chapter)

#### هيكل الحديث
```json
{
  "number": "1",
  "arab": "النص العربي للحديث",
  "text": "English translation of the hadith",
  "reference": {
    "book": "اسم الكتاب",
    "chapter": "اسم الباب",
    "number": "رقم الحديث"
  }
}
```
1. Next INSHALLAH will add more formats.

See all Types in the [`types/index.d.ts`](./types/index.d.ts) file.

Every Hadih is an object with the following format:

```typescript
interface Hadith {
	id: number;
	chapterId: number;
	bookId: number;
	arabic: string;
	english: {
		narrator: string;
		text: string;
	};
}
```

## Commands:

-  `npm install` - Installs the dependencies.
-  `npm run build` - Compiles the TypeScript files to JavaScript.
-  `npm run start` - Starts the script that scrapes the data from Sunnah.com.
-  `npm run dev:build` - Compiles the TypeScript files to JavaScript in watch mode.
-  `npm run dev:start` - Starts the script that scrapes the data from Sunnah.com in watch mode.

## Project Structure:

```
.
├── db
│   ├── by_book
│   │   │   ├── the_9_books
│   │   │   │   ├── bukhari.json
│   │   │   │   ├── muslim.json
│   │   │   │   ├── ...
│   │   │   ├── forties
│   │   │   │   ├── nawawi40.json
│   │   │   │   ├── ...
│   │   │   ├── ...
│   ├── by_chapter
│   │   ├── the_9_books
│   │   │   ├── bukhari
│   │   │   │   ├── 1.json
│   │   │   │   ├── 2.json
│   │   │   │   ├── ...
│   │   │   ├── muslim
│   │   │   │   ├── ...
│   │   │   ├── ...
│   │   ├── forties
│   │   │   ├── nawawi40
│   │   │   │   ├── 1.json
│   │   │   │   ...
│   │   │   other_books
│   │   │   │   RyadSalihin
│   │   │   │   │   ├── 1.json
│   │   ...
│   ├── by_book
│   src
│   │   ├── index.ts
│   │   ├── types
│   │   ├── helpers
│   ...
```

## Notes:

- In Musnad Ahmed, the chapters from 8 to 30 are missing in the source data. If you know better source for this book, please let us know.
- The source code for scraping in the `src` directory is not perfect. I wrote it when I was a beginner to practice scraping. It needs refactoring. (BTW, it works fine 😅)

## Contributing:

Contributions are welcome. Please open an issue or a pull request.

## Conclusion:

May Allah accept this work and make it beneficial for all Muslims. Ameen.