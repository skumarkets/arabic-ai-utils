# Arabic AI Utils 🤖

<div align="center" dir="auto">

[![GitHub license](https://img.shields.io/github/license/skumarkets/arabic-ai-utils)](https://github.com/skumarkets/arabic-ai-utils/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/arabic-ai-utils.svg)](https://badge.fury.io/js/arabic-ai-utils)
[![GitHub issues](https://img.shields.io/github/issues/skumarkets/arabic-ai-utils)](https://github.com/skumarkets/arabic-ai-utils/issues)
[![GitHub stars](https://img.shields.io/github/stars/skumarkets/arabic-ai-utils)](https://github.com/skumarkets/arabic-ai-utils/stargazers)

<div dir="rtl">

**أدوات مفتوحة المصدر للذكاء الاصطناعي باللغة العربية واللهجات العربية**

</div>

*Open-source Arabic AI utilities for text processing and dialect conversion*

[العربية](#العربية) | [English](#english)

</div>

---

<div dir="rtl">

## العربية

### 📖 نظرة عامة

مكتبة شاملة من الأدوات المتخصصة في معالجة النصوص العربية باستخدام تقنيات الذكاء الاصطناعي. تهدف هذه المكتبة إلى تسهيل العمل مع النصوص العربية واللهجات المحلية للمطورين والباحثين.

### ✨ المميزات

- 🧹 **تنظيف النصوص العربية** - إزالة التشكيل والرموز غير المرغوبة
- 🗣️ **تحويل اللهجات** - التحويل بين الفصحى واللهجات المحلية  
- 🔑 **استخراج الكلمات المفتاحية** - تحليل وفهرسة المحتوى العربي
- ⚡ **أداء عالي** - محسّن للاستخدام في بيئات الإنتاج
- 🎯 **سهولة الاستخدام** - واجهات برمجية بسيطة ومفهومة
- 🌐 **دعم RTL** - دعم كامل لاتجاه النص من اليمين إلى اليسار

### 🛠️ الأدوات المتوفرة

#### 1. 🧹 منظف النصوص العربية (Text Cleaner)

يقوم بتنظيف النصوص العربية من خلال:

- إزالة التشكيل والحركات
- حذف الرموز والأرقام غير الضرورية  
- تنظيف المسافات الزائدة والتكرارات
- تحضير النص للمعالجة والتحليل

**مثال على الاستخدام:**

```javascript
const { textCleaner } = require("arabic-ai-utils");

const dirtyText = "فيه رموز ٪٪ وأرقام 123 ونقاط غير ضرورية!";
const cleanText = textCleaner.clean(dirtyText);
console.log(cleanText); // "فيه رموز وأرقام ونقاط غير ضرورية"

// مع خيارات مخصصة
const cleanTextCustom = textCleaner.clean(dirtyText, {
  removeNumbers: true,
  removeSymbols: true,
  removeDiacritics: true
});
```

#### 2. 🗣️ محول اللهجات (Dialect Converter)

يحول النصوص بين العربية الفصحى واللهجات المحلية:

- **اللهجات المدعومة:** العراقية، المصرية، الشامية، الخليجية
- **التحويل ثنائي الاتجاه** بين الفصحى واللهجات
- **دقة عالية** في التحويل والحفاظ على المعنى

**مثال على الاستخدام:**

```javascript
const { dialectConverter } = require("arabic-ai-utils");

// من العراقية للفصحى
const iraqi = "شلونك اليوم؟";
const msa = dialectConverter.convert(iraqi, { from: "iraqi", to: "msa" });
console.log(msa); // "كيف حالك اليوم؟"

// من الفصحى للمصرية  
const arabic = "كيف حالك؟";
const egyptian = dialectConverter.convert(arabic, {
  from: "msa",
  to: "egyptian",
});
console.log(egyptian); // "إزيك؟"

// عرض اللهجات المدعومة
console.log(dialectConverter.getSupportedDialects());
```

#### 3. 🔑 مستخرج الكلمات المفتاحية (Keyword Extractor)

يستخرج الكلمات والعبارات المهمة من النصوص العربية:

- **خوارزميات متقدمة** لتحليل أهمية الكلمات
- **دعم العبارات المركبة** والمصطلحات المتخصصة
- **تقييم دقيق** لأهمية كل كلمة مفتاحية
- **طرق مختلفة للاستخراج** (TF-IDF, Frequency, Weighted)

**مثال على الاستخدام:**

```javascript
const { keywordExtractor } = require("arabic-ai-utils");

const text = "الذكاء الاصطناعي يغير مستقبل العالم، ويساهم في تطوير حلول مبتكرة";
const keywords = keywordExtractor.extract(text, { 
  limit: 5, 
  includeScore: true,
  method: 'tfidf'
});

console.log(keywords);
// [
//   { word: "الذكاء", score: 8.5, frequency: 1 },
//   { word: "الاصطناعي", score: 7.2, frequency: 1 },
//   ...
// ]

// استخراج العبارات
const phrases = keywordExtractor.extractPhrases(text, { 
  nGram: 2, 
  limit: 3 
});
console.log(phrases);
```

### 🛠️ المساعدات (Helpers)

مجموعة من الوظائف المساعدة للتعامل مع النصوص العربية:

```javascript
const { helpers } = require("arabic-ai-utils");

// التحقق من وجود أحرف عربية
const hasArabic = helpers.isArabic("نص عربي مع English"); // true

// تحديد اتجاه النص
const direction = helpers.detectTextDirection("النص العربي"); // 'rtl'

// تطبيع النص العربي
const normalized = helpers.normalizeArabic("أهلاً وسهلاً"); 

// تحويل الأرقام
const englishNums = helpers.arabicToEnglishNumerals("١٢٣"); // "123"

// إحصائيات النص
const stats = helpers.getTextStats("النص العربي للتحليل");
console.log(stats);
// {
//   characters: 20,
//   words: 3,
//   arabicWords: 3,
//   direction: 'rtl',
//   hasArabic: true
// }
```

### 📦 التثبيت

```bash
npm install arabic-ai-utils
```

أو باستخدام yarn:

```bash
yarn add arabic-ai-utils
```

### 🚀 البدء السريع

```javascript
const {
  textCleaner,
  dialectConverter,
  keywordExtractor,
  helpers
} = require("arabic-ai-utils");

// تنظيف النص
const cleanText = textCleaner.clean("نص عربي مع رموز غير مرغوبة!");

// تحويل اللهجة
const dialectText = dialectConverter.convert("كيف حالك؟", {
  from: "msa", 
  to: "egyptian",
});

// استخراج الكلمات المفتاحية
const keywords = keywordExtractor.extract(
  "نص عربي للتحليل واستخراج الكلمات المهمة"
);

// استخدام المساعدات
const isRTL = helpers.detectTextDirection("النص العربي") === 'rtl';

console.log({ cleanText, dialectText, keywords, isRTL });
```

### 🧪 الاختبار

```bash
npm test
```

### 📁 هيكل المشروع

```
arabic-ai-utils/
├── tools/
│   ├── text-cleaner/        # أداة تنظيف النصوص
│   │   ├── index.js         # التطبيق الرئيسي
│   │   └── examples/        # أمثلة الاستخدام
│   ├── dialect-converter/   # أداة تحويل اللهجات
│   │   ├── index.js
│   │   └── examples/
│   └── keyword-extractor/   # أداة استخراج الكلمات المفتاحية
│       ├── index.js
│       └── examples/
├── utils/                   # المساعدات والوظائف المشتركة
│   └── helpers.js
├── test/                    # ملفات الاختبار
├── index.js                 # نقطة الدخول الرئيسية
└── README.md               # هذا الملف
```

### 🎯 حالات الاستخدام

- **تحضير البيانات للذكاء الاصطناعي**: تنظيف وتحضير النصوص العربية للتدريب
- **محركات البحث**: استخراج الكلمات المفتاحية لتحسين الفهرسة
- **معالجة اللغة الطبيعية**: تطبيقات الترجمة والفهم اللغوي
- **تطبيقات الشات بوت**: تحويل بين اللهجات للتفاعل الطبيعي
- **تحليل المحتوى**: فهم وتصنيف النصوص العربية
- **تطبيقات وسائل التواصل**: معالجة المحتوى العربي

### 🤝 المساهمة

نرحب بمساهماتكم! الرجاء اتباع الخطوات التالية:

1. **Fork المشروع** على GitHub
2. **أنشئ branch للميزة الجديدة**: `git checkout -b feature/amazing-feature`
3. **Commit التغييرات**: `git commit -m 'إضافة ميزة رائعة'`
4. **Push إلى الـ branch**: `git push origin feature/amazing-feature`
5. **افتح Pull Request** مع شرح مفصل للتغييرات

#### إرشادات المساهمة:

- اتبع معايير الترميز الموجودة
- أضف اختبارات للميزات الجديدة  
- تأكد من دعم RTL في جميع التحديثات
- اكتب تعليقات واضحة باللغة العربية والإنجليزية
- احرص على التوافق مع الإصدارات السابقة

### 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

### 🐛 الإبلاغ عن المشاكل

إذا واجهت أي مشاكل أو لديك اقتراحات، الرجاء:

1. **فتح issue** على [GitHub Issues](https://github.com/skumarkets/arabic-ai-utils/issues)
2. **تضمين معلومات مفصلة** عن المشكلة
3. **إرفاق أمثلة** على الكود إذا أمكن
4. **تحديد نظام التشغيل** وإصدار Node.js

### 🌟 الدعم

إذا أعجبك هذا المشروع:

- أعطه نجمة ⭐ على [GitHub](https://github.com/skumarkets/arabic-ai-utils)
- شاركه مع المطورين الآخرين
- اتبع التحديثات للحصول على الميزات الجديدة

### 🔄 التحديثات القادمة

- [ ] إضافة المزيد من اللهجات العربية
- [ ] تحسين دقة خوارزميات استخراج الكلمات المفتاحية
- [ ] إضافة دعم للتشكيل الذكي
- [ ] تطوير واجهة ويب للاختبار
- [ ] إضافة دعم TypeScript
- [ ] تحسين الأداء للنصوص الطويلة

</div>

---

<div dir="ltr">

## English

### 📖 Overview

A comprehensive library of specialized tools for Arabic text processing using artificial intelligence techniques. This library aims to facilitate working with Arabic texts and local dialects for developers and researchers, with full RTL (Right-to-Left) support.

### ✨ Features

- 🧹 **Arabic Text Cleaning** - Remove diacritics and unwanted symbols
- 🗣️ **Dialect Conversion** - Convert between Modern Standard Arabic and local dialects
- 🔑 **Keyword Extraction** - Analyze and index Arabic content  
- ⚡ **High Performance** - Optimized for production environments
- 🎯 **Easy to Use** - Simple and understandable APIs
- 🌐 **RTL Support** - Full Right-to-Left text direction support

### 🛠️ Available Tools

#### 1. 🧹 Arabic Text Cleaner

Cleans Arabic texts by:
- Removing diacritics and vowel marks
- Deleting unnecessary symbols and numbers
- Cleaning extra spaces and repetitions  
- Preparing text for processing and analysis

#### 2. 🗣️ Dialect Converter

Converts texts between Modern Standard Arabic and local dialects:
- **Supported Dialects:** Iraqi, Egyptian, Levantine, Gulf
- **Bidirectional conversion** between MSA and dialects
- **High accuracy** in conversion while preserving meaning

#### 3. 🔑 Keyword Extractor

Extracts important words and phrases from Arabic texts:
- **Advanced algorithms** for analyzing word importance
- **Support for compound phrases** and specialized terms  
- **Accurate evaluation** of each keyword's importance
- **Multiple extraction methods** (TF-IDF, Frequency, Weighted)

### 📦 Installation

```bash
npm install arabic-ai-utils
```

### 🚀 Quick Start

```javascript
const {
  textCleaner,
  dialectConverter, 
  keywordExtractor,
  helpers
} = require("arabic-ai-utils");

// Clean text
const cleanText = textCleaner.clean("Arabic text with unwanted symbols!");

// Convert dialect
const dialectText = dialectConverter.convert("How are you?", {
  from: "msa",
  to: "egyptian"
});

// Extract keywords
const keywords = keywordExtractor.extract(
  "Arabic text for analysis and keyword extraction"
);

// Use helpers
const direction = helpers.detectTextDirection("Arabic text"); // 'rtl'
```

### 🤝 Contributing

We welcome your contributions! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`) 
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</div>
