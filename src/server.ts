import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { readFileSync } from 'fs';
import { books } from './books';
import { extractNarrators } from './helpers/extractNarrators';
import { extractGrade } from './helpers/extractGrade';
import { HadithWithNarrators } from './types/narrators';
import { HadithGrade } from './types/hadith';

const app = express();
const port = 3000;

// تخزين مؤقت للرواة والأحاديث
const narratorsCache = new Map<string, Set<string>>();
const hadithCache = new Map<string, HadithWithNarrators>();

// إعدادات CORS
const corsOptions = {
  origin: '*', // السماح لجميع المصادر
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// تمكين CORS مع الإعدادات المخصصة
app.use(cors(corsOptions));

// الصفحة الرئيسية مع قائمة نقاط النهاية المتاحة
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: "مرحباً بكم في خدمة API للأحاديث",
    availableEndpoints: {
      "api/books": "قائمة جميع الكتب",
      "api/book/:bookName": "الحصول على كتاب محدد",
      "api/chapter/:bookName/:chapterNumber": "الحصول على باب محدد من كتاب",
      "api/hadith/:id": "الحصول على حديث محدد برقمه",
      "api/search?q=:query": "البحث في متن الحديث",
      "api/hadith/by-narrator?name=:name": "البحث عن الأحاديث حسب الراوي",
      "api/hadith/by-grade?grade=:grade": "البحث عن الأحاديث حسب الدرجة",
      "/book/:collection/:bookName": "الحصول على كتاب محدد من مجموعة محددة"
    }
  });
});

// البحث في متن الحديث
app.get('/api/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Missing search query parameter (q)' });
  }
  const results: any[] = [];

  for (const book of books) {
    try {
      const bookPath = Array.isArray(book.path) ? book.path.join('/') : book.path;
      const bookContent = readFileSync(path.join(__dirname, '..', 'db', 'by_book', bookPath), 'utf-8');
      const hadiths = JSON.parse(bookContent);
      
      const matchingHadiths = hadiths.filter((hadith: any) => 
        hadith.arabic.toLowerCase().includes(query) || 
        hadith.english.toLowerCase().includes(query)
      );
      
      results.push(...matchingHadiths);
    } catch (error) {
      console.error(`Error searching in book ${book.path}:`, error);
    }
  }

  res.json(results);
});

// البحث عن الأحاديث حسب الدرجة
app.get('/api/hadith/by-grade', (req: Request, res: Response) => {
  const gradeParam = decodeURIComponent(req.query.grade as string || '');
  const validGrades: HadithGrade[] = [
    'صحيح', 'حسن', 'ضعيف', 'صحيح لغيره', 'حسن لغيره',
    'ضعيف جداً', 'موضوع', 'مقبول', 'متفق عليه', 'غير معروف'
  ];

  if (!validGrades.includes(gradeParam as HadithGrade)) {
    return res.status(400).json({ error: 'Invalid grade parameter' });
  }

  const grade = gradeParam as HadithGrade;
  const results: any[] = [];

  for (const book of books) {
    try {
      const bookPath = Array.isArray(book.path) ? book.path.join('/') : book.path;
      const bookContent = readFileSync(path.join(__dirname, '..', 'db', 'by_book', bookPath), 'utf-8');
      const hadiths = JSON.parse(bookContent);
      
      const matchingHadiths = hadiths.filter((hadith: any) => {
        const gradeInfo = extractGrade(hadith.arabic, hadith.english);
        return gradeInfo?.grade === grade;
      });
      
      results.push(...matchingHadiths);
    } catch (error) {
      console.error(`Error searching by grade in book ${book.path}:`, error);
    }
  }

  res.json(results);
});

// الحصول على حديث محدد برقمه
app.get('/hadith/:id', (req: Request, res: Response) => {
  const hadithId = parseInt(req.params.id);
  
  for (const book of books) {
    try {
      const bookPath = Array.isArray(book.path) ? book.path.join('/') : book.path;
      const bookContent = readFileSync(path.join(__dirname, '..', 'db', 'by_book', bookPath), 'utf-8');
      const hadiths = JSON.parse(bookContent);
      
      const hadith = hadiths.find((h: any) => h.id === hadithId);
      if (hadith) {
        return res.json({
          ...hadith,
          narratorChain: extractNarrators(hadith.arabic),
          grade: extractGrade(hadith.arabic, hadith.english)
        });
      }
    } catch (error) {
      console.error(`Error finding hadith in book ${book.path}:`, error);
    }
  }

  res.status(404).json({ error: 'Hadith not found' });
});

// البحث عن الأحاديث حسب الراوي
app.get('/search/narrator/:name', (req: Request, res: Response) => {
  const narratorName = req.params.name;
  const results: HadithWithNarrators[] = [];

  // البحث في جميع الكتب
  for (const book of books) {
    try {
      const bookPath = Array.isArray(book.path) ? book.path.join('/') : book.path;
      const bookContent = readFileSync(path.join(__dirname, '..', 'db', 'by_book', bookPath), 'utf-8');
      const hadiths = JSON.parse(bookContent);
      
      for (const hadith of hadiths) {
        const narratorChain = extractNarrators(hadith.arabic);
        if (narratorChain && narratorChain.chain.some(n => 
          n.name.arabic.includes(narratorName) || 
          n.name.english.toLowerCase().includes(narratorName.toLowerCase())
        )) {
          results.push({
            ...hadith,
            narratorChain,
            grade: extractGrade(hadith.arabic, hadith.english)
          });
        }
      }
    } catch (error) {
      console.error(`Error processing book ${book.path}:`, error);
    }
  }

  res.json(results);
});

// الحصول على شجرة الإسناد لحديث معين
app.get('/hadith/:bookId/:hadithId/isnad', (req: Request, res: Response) => {
  const { bookId, hadithId } = req.params;
  const book = books.find(b => b.id === parseInt(bookId));
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  try {
    const bookPath = Array.isArray(book.path) ? book.path.join('/') : book.path;
    const bookContent = readFileSync(path.join(__dirname, '..', 'db', 'by_book', bookPath), 'utf-8');
    const hadiths = JSON.parse(bookContent);
    const hadith = hadiths.find((h: any) => h.id === parseInt(hadithId));

    if (!hadith) {
      return res.status(404).json({ error: 'Hadith not found' });
    }

    const narratorChain = extractNarrators(hadith.arabic);
    res.json({
      hadithId: hadith.id,
      narratorChain,
      grade: extractGrade(hadith.arabic, hadith.english)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// إضافة Headers إضافية للأمان
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// تحليل طلبات JSON
app.use(express.json());

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// الحصول على معلومات حديث كاملة
app.get('/hadith/:id/full', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching full details for hadith:', id);
        
        // البحث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                const hadith = bookData.hadiths.find((h: any) => h.id === parseInt(id));
                if (hadith) {
                    // استخراج معلومات الحديث
                    const narrators = extractNarrators(hadith.arabic);
                    const hadithGrade = extractGrade(hadith.arabic, hadith.english.text);
                    
                    // تجميع معلومات الكتاب
                    const bookInfo = {
                        id: book.id,
                        name: {
                            arabic: book.arabic.title,
                            english: book.english.title
                        },
                        author: {
                            arabic: book.arabic.author,
                            english: book.english.author
                        },
                        path: book.path
                    };

                    // تحليل النص العربي لاستخراج المتن والسند
                    const parts = hadith.arabic.split(/[.:](?=\s)/);
                    const isnad = parts.length > 1 ? parts[0] : '';
                    const matn = parts.length > 1 ? parts.slice(1).join('. ') : hadith.arabic;

                    // تجميع كل المعلومات
                    res.json({
                        id: hadith.id,
                        book: bookInfo,
                        chapter: hadith.chapterId,
                        numberInBook: hadith.idInBook,
                        grade: {
                            value: hadithGrade ? hadithGrade.grade : 'غير معروف',
                            source: hadithGrade?.source,
                        },
                        text: {
                            arabic: {
                                full: hadith.arabic,
                                isnad: isnad.trim(),
                                matn: matn.trim()
                            },
                            english: {
                                narrator: hadith.english.narrator,
                                text: hadith.english.text
                            }
                        },
                        narrators: {
                            chain: narrators.chain,
                            tree: narrators,
                            count: narrators.chain.length
                        },
                        references: {
                            primary: `${book.arabic.title} - حديث رقم ${hadith.idInBook}`,
                            secondary: []
                        }
                    });
                    return;
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.status(404).json({ error: 'الحديث غير موجود' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// البحث عن الأحاديث حسب الدرجة
// تجربة السيرفر
app.get('/test', (req, res) => {
    res.json({ message: 'السيرفر يعمل بشكل صحيح' });
});

app.get('/hadith/by-grade/:grade', (req, res) => {
    try {
        const { grade } = req.params;
        console.log('Searching for hadiths with grade:', grade);
        console.log('Request parameters:', req.params);
        console.log('Request query:', req.query);
        const results: HadithWithNarrators[] = [];
        
        // البحث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                // البحث في أحاديث الكتاب
                for (const hadith of bookData.hadiths) {
                    const narrators = extractNarrators(hadith.arabic);
                    const hadithGrade = extractGrade(hadith.arabic, hadith.english.text);
                    
                    if (hadithGrade && hadithGrade.grade === grade) {
                        results.push({
                            ...hadith,
                            narrators,
                            grade: hadithGrade.grade,
                            gradeSource: hadithGrade.source
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        // البحث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                // البحث في أحاديث الكتاب
                for (const hadith of bookData.hadiths) {
                    if (hadith.grade && hadith.grade === grade) {
                        const narrators = extractNarrators(hadith.arabic);
                        results.push({
                            ...hadith,
                            narrators
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.json({
            count: results.length,
            results
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.json({
        message: 'مرحباً بكم في خدمة API للأحاديث',
        availableEndpoints: {
            '/books': 'قائمة جميع الكتب',
            '/book/:bookName': 'الحصول على كتاب محدد',
            '/chapter/:bookName/:chapterNumber': 'الحصول على باب محدد من كتاب'
        }
    });
});

// الحصول على قائمة الكتب
app.get('/books', (req, res) => {
    res.json(books.map(book => ({
        name: book.english.title,
        arabicName: book.arabic.title,
        author: book.english.author,
        arabicAuthor: book.arabic.author,
        path: book.path.join('/')
    })));
});

// الحصول على كتاب محدد
app.get('/book/:category/:bookName', (req, res) => {
    try {
        const { category, bookName } = req.params;
        // إزالة .json من اسم الملف إذا كان موجوداً
        const cleanBookName = bookName.replace('.json', '');
        const filePath = path.join(process.cwd(), 'db', 'by_book', category, `${cleanBookName}.json`);
        
        try {
            const fileContent = readFileSync(filePath, 'utf8');
            const bookData = JSON.parse(fileContent);
            res.json(bookData);
        } catch (error) {
            console.error('Error reading book file:', error);
            res.status(404).json({ 
                error: 'الكتاب غير موجود',
                details: `لا يمكن العثور على الكتاب في المسار: ${category}/${cleanBookName}`
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// البحث عن الأحاديث حسب الراوي
app.get('/api/hadith/by-narrator', (req, res) => {
    try {
        const narratorName = req.query.name as string;
        if (!narratorName) {
            return res.status(400).json({ error: 'Missing narrator name parameter (name)' });
        }
        console.log('Searching for narrator:', narratorName);
        const results: HadithWithNarrators[] = [];
        console.log('Total books to search:', books.length);
        
        // البحث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                // البحث في أحاديث الكتاب
                for (const hadith of bookData.hadiths) {
                    const narrators = extractNarrators(hadith.arabic);
                    if (narrators.chain.some(n => 
                        n.name.arabic.includes(narratorName) || 
                        n.name.english.toLowerCase().includes(narratorName.toLowerCase())
                    )) {
                        results.push({
                            ...hadith,
                            narrators
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.json({
            count: results.length,
            results
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// الحصول على شجرة الإسناد لحديث معين
app.get('/api/hadith/:id/isnad', (req, res) => {
    try {
        const { id } = req.params;
        console.log('Searching for hadith ID:', id);
        
        // البحث عن الحديث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                const hadith = bookData.hadiths.find((h: any) => h.id === parseInt(id));
                if (hadith) {
                    // تقسيم النص إلى سند ومتن
                    const parts = hadith.arabic.split(/[.:](?=\s)/);
                    const isnadText = parts.length > 1 ? parts[0] : hadith.arabic;
                    
                    // استخراج معلومات الرواة من السند فقط
                    const narrators = extractNarrators(isnadText);
                    res.json({
                        id: hadith.id,
                        isnadText: isnadText,
                        bookInfo: {
                            name: {
                                arabic: book.arabic.title,
                                english: book.english.title
                            },
                            author: {
                                arabic: book.arabic.author,
                                english: book.english.author
                            }
                        },
                        narratorsChain: {
                            count: narrators.chain.length,
                            narrators: narrators.chain.map(narrator => ({
                                name: narrator.name,
                                title: narrator.title
                            }))
                        }
                    });
                    return;
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.status(404).json({ error: 'الحديث غير موجود' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// الحصول على قائمة الرواة
app.get('/narrators', (req, res) => {
    try {
        const narrators = new Set<string>();
        
        // جمع الرواة من جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                for (const hadith of bookData.hadiths) {
                    const extractedNarrators = extractNarrators(hadith.arabic);
                    extractedNarrators.chain.forEach(narrator => {
                        narrators.add(narrator.name.arabic);
                    });
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.json({
            count: narrators.size,
            narrators: Array.from(narrators).sort()
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// الحصول على باب محدد
app.get('/chapter/:bookName/:chapterNumber', (req, res) => {
    try {
        const { bookName, chapterNumber } = req.params;
        let category = 'the_9_books';
        
        // تحديد الفئة بناءً على اسم الكتاب
        if (bookName.includes('nawawi40') || bookName.includes('qudsi40') || bookName.includes('shahwaliullah40')) {
            category = 'forties';
        } else if (['riyad_assalihin', 'aladab_almufrad', 'bulugh_almaram', 'shamail_muhammadiyah', 'mishkat_almasabih'].includes(bookName)) {
            category = 'other_books';
        }
        
        const filePath = path.join(
            process.cwd(),
            'db',
            'by_chapter',
            category,
            bookName,
            `${chapterNumber}.json`
        );
        
        try {
            const fileContent = readFileSync(filePath, 'utf8');
            const chapterData = JSON.parse(fileContent);
            res.json(chapterData);
        } catch (error) {
            console.error('Error reading chapter file:', error);
            res.status(404).json({ 
                error: 'الباب غير موجود',
                details: `لا يمكن العثور على الباب في المسار: ${category}/${bookName}/${chapterNumber}`
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});

// الحصول على معلومات حديث كاملة
app.get('/api/hadith/:id/full', (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching full details for hadith:', id);
        
        // البحث في جميع الكتب
        for (const book of books) {
            const bookPath = path.join(process.cwd(), 'db', 'by_book', ...book.path) + '.json';
            try {
                const bookContent = readFileSync(bookPath, 'utf8');
                const bookData = JSON.parse(bookContent);
                
                const hadith = bookData.hadiths.find((h: any) => h.id === parseInt(id));
                if (hadith) {
                    // تقسيم النص العربي لاستخراج المتن والسند
                    const parts = hadith.arabic.split(/[.:](?=\s)/);
                    const isnadText = parts.length > 1 ? parts[0] : '';
                    const matnText = parts.length > 1 ? parts.slice(1).join('. ') : hadith.arabic;

                    // استخراج معلومات السند والدرجة
                    const narrators = extractNarrators(isnadText);
                    const gradeInfo = extractGrade(hadith.arabic, hadith.english.text);
                    
                    // تحديد درجة الحديث بناءً على عدة معايير
                    let hadithGrade = "غير معروف";
                    let gradeSource = undefined;
                    
                    // 1. التحقق من وجود كلمة "صحيحيهما" في النص
                    if (hadith.arabic.includes("صحيحيهما")) {
                        hadithGrade = "متفق عليه";
                        gradeSource = "البخاري ومسلم";
                    }
                    // 2. التحقق من معلومات الدرجة المستخرجة
                    else if (gradeInfo) {
                        hadithGrade = gradeInfo.grade;
                        gradeSource = gradeInfo.source;
                    }
                    // 3. التحقق من مصدر الكتاب
                    else if (book.path.includes("bukhari")) {
                        hadithGrade = "صحيح";
                        gradeSource = "البخاري";
                    }
                    else if (book.path.includes("muslim")) {
                        hadithGrade = "صحيح";
                        gradeSource = "مسلم";
                    }

                    res.json({
                        id: hadith.id,
                        book: {
                            id: book.id,
                            name: {
                                arabic: book.arabic.title,
                                english: book.english.title
                            },
                            author: {
                                arabic: book.arabic.author,
                                english: book.english.author
                            },
                            path: book.path
                        },
                        chapter: hadith.chapterId || 0,
                        numberInBook: hadith.idInBook,
                        grade: {
                            value: hadithGrade,
                            source: gradeSource
                        },
                        text: {
                            arabic: {
                                full: hadith.arabic,
                                isnad: isnadText.trim(),
                                matn: matnText.trim()
                            },
                            english: {
                                narrator: hadith.english.narrator || "",
                                text: hadith.english.text || ""
                            }
                        },
                        narrators: {
                            chain: narrators.chain.map(n => ({
                                name: n.name,
                                title: n.title,
                                level: n.level
                            })),
                            tree: narrators,
                            count: narrators.chain.length
                        },
                        references: {
                            primary: `${book.arabic.title} - حديث رقم ${hadith.idInBook}`,
                            secondary: []
                        }
                    });
                    return;
                }
            } catch (error) {
                console.error(`Error processing book ${book.path.join('/')}: ${error}`);
            }
        }
        
        res.status(404).json({ error: 'الحديث غير موجود' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'خطأ في معالجة الطلب' });
    }
});