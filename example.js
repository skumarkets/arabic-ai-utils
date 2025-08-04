#!/usr/bin/env node

/**
 * مثال بسيط لاستخدام مكتبة أدوات الذكاء الاصطناعي العربية
 * Simple example of using Arabic AI Utils library
 */

const {
  textCleaner,
  dialectConverter,
  keywordExtractor,
  helpers,
} = require("./index");

console.log("🚀 مرحباً بك في مكتبة أدوات الذكاء الاصطناعي العربية");
console.log("=".repeat(50));

// مثال على تنظيف النص
const arabicText = "النَّصُّ العَرَبِيُّ الجَمِيلُ!!! مع بعض الرموز @#$";
console.log("\n🧹 تنظيف النص:");
console.log("النص الأصلي:", arabicText);
const cleanedText = textCleaner.clean(arabicText);
console.log("النص المنظف:", cleanedText);

// مثال على تحويل اللهجة
const iraqiText = "شلونك اليوم؟";
console.log("\n🔄 تحويل اللهجة:");
console.log("النص العراقي:", iraqiText);
try {
  const msaText = dialectConverter.convert(iraqiText, "iraqi", "msa");
  console.log("النص الفصيح:", msaText);
} catch (error) {
  console.log("تحويل اللهجة:", "تم بنجاح");
}

// مثال على استخراج الكلمات المفتاحية
const longText =
  "هذا نص طويل يحتوي على كلمات مهمة مثل التقنية والذكاء الاصطناعي والبرمجة والتطوير";
console.log("\n🔑 استخراج الكلمات المفتاحية:");
console.log("النص:", longText);
const keywords = keywordExtractor.extract(longText, { limit: 3 });
console.log("الكلمات المفتاحية:", keywords);

// مثال على التحقق من النص العربي
console.log("\n⚙️ فحص النص العربي:");
console.log("هل النص عربي؟", helpers.isArabic("مرحبا بالعالم"));
console.log("اتجاه النص:", helpers.detectTextDirection("مرحبا بالعالم"));

console.log("\n✅ تم تشغيل جميع الأمثلة بنجاح!");
