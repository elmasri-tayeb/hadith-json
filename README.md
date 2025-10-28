# 📚 Hadith API (واجهة برمجة الأحاديث)

<div dir="rtl">

قاعدة بيانات شاملة للأحاديث النبوية الشريفة مع واجهة برمجة تطبيقات (API) حديثة. تتيح الوصول إلى أكثر من 50,000 حديث من 17 كتاباً من كتب السنة، مع دعم كامل للغتين العربية والإنجليزية، وإمكانيات بحث متقدمة في المتن والإسناد.

</div>

## 🌟 Features

- **Comprehensive Collection**: 50,884 hadiths from 17 authentic books
- **Bilingual Support**: Full Arabic and English translations
- **Advanced Search**: Search by text, narrator, or grade
- **Rich Metadata**: Includes grades, narrators chain, and references
- **Smart Isnad Analysis**: 
  - Automatic narrator classification (Prophet, Companion, Scholar, etc.)
  - Full narrator chain with proper hierarchy
  - Detection of narrator types and titles
  - Support for multiple narration paths
- **Modern API**: 
  - RESTful endpoints with JSON responses
  - Efficient search across all collections
  - Smart caching for better performance
- **Well Documented**: Detailed API documentation with examples
- **Enhanced Narrator Search**: 
  - Search by narrator name in Arabic or English
  - Filter by narrator type or level
  - Search across multiple collections
- **Grade Analysis**: Automatic hadith grade detection and validation

## Hadiths Count:

-  Total Hadiths: 50,884 Hadiths.

## 📚 Available Books

### The Nine Books (الكتب التسعة)
- Sahih al-Bukhari (صحيح البخاري)
- Sahih Muslim (صحيح مسلم)
- Sunan Abi Dawud (سنن أبي داود)
- Jami` at-Tirmidhi (جامع الترمذي)
- Sunan an-Nasa'i (سنن النسائي)
- Sunan Ibn Majah (سنن ابن ماجه)
- Muwatta Malik (موطأ مالك)
- Musnad Ahmad (مسند أحمد)
- Sunan ad-Darimi (سنن الدارمي)

### Collections of Forty (كتب الأربعين)
- The Forty Hadith of al-Imam an-Nawawi (الأربعون النووية)
- The Forty Hadith Qudsi (الأربعون القدسية)
- The Forty Hadith of Shah Waliullah (أربعون الشاه ولي الله)

### Other Books (كتب أخرى)
- Riyad as-Salihin (رياض الصالحين)
- Al-Adab Al-Mufrad (الأدب المفرد)
- Bulugh al-Maram (بلوغ المرام)
- Mishkat al-Masabih (مشكاة المصابيح)
- Shamail Muhammadiyah (الشمائل المحمدية)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/elmasri-tayeb/hadith-json.git

# Navigate to project directory
cd hadith-json

# Install dependencies
npm install

# Start the server
npm run serve
```

### Basic Usage

```bash
# Get a specific hadith
curl http://localhost:3000/hadith/40944

# Search in hadith text
curl http://localhost:3000/search?q=النية

# Get hadiths by narrator
curl http://localhost:3000/hadith/by-narrator/أبو%20هريرة
```

## 📖 Documentation

Detailed API documentation is available in three formats:
- [API Guide (English)](API_GUIDE.md)
- [API Guide (Arabic)](PROMPT_GUIDE.md)
- [Isnad Documentation](ISNAD_GUIDE.md)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Libraries**: Express, Cheerio.js, Axios
- **Testing**: Jest
- **Documentation**: Markdown
- **Version Control**: Git

## 📊 Statistics

- **Total Hadiths**: 50,884
- **Languages**: Arabic & English
- **Books**: 17
- **API Endpoints**: 7
- **Response Format**: JSON
- **UTF-8 Support**: Yes

## 🔄 Data Updates

The database is regularly updated and verified against trusted sources. Data is scraped from [Sunnah.com](https://sunnah.com/) and thoroughly processed to ensure accuracy.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data sourced from [Sunnah.com](https://sunnah.com/)
- Special thanks to all contributors and Islamic scholars

<div dir="rtl">

## تنويه

هذا المشروع هو مصدر مفتوح يهدف إلى تسهيل الوصول إلى الأحاديث النبوية الشريفة للمطورين والباحثين. نرجو استخدام هذه الأداة بما يخدم الإسلام والمسلمين.

</div>

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