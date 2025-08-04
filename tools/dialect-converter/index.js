/**
 * Arabic Dialect Converter - محول اللهجات العربية
 * Converts between Modern Standard Arabic (MSA) and various Arabic dialects
 */

class ArabicDialectConverter {
  constructor() {
    // قاموس التحويلات للهجات المختلفة
    this.dialectMappings = {
      // العراقية إلى الفصحى
      iraqi_to_msa: {
        شلونك: "كيف حالك",
        شلون: "كيف",
        وين: "أين",
        شنو: "ماذا",
        كلش: "كثيراً",
        هواي: "كثيراً",
        ماكو: "لا يوجد",
        اكو: "يوجد",
        بيه: "به",
        مال: "لماذا",
        داخل: "داخل إلى",
        طالع: "خارج من",
      },

      // المصرية إلى الفصحى
      egyptian_to_msa: {
        إزيك: "كيف حالك",
        إزي: "كيف",
        فين: "أين",
        إيه: "ماذا",
        أوي: "كثيراً",
        خالص: "تماماً",
        كده: "هكذا",
        علشان: "لأن",
        عايز: "أريد",
        عاوز: "أريد",
        جاي: "قادم",
        رايح: "ذاهب",
      },

      // الشامية إلى الفصحى
      levantine_to_msa: {
        كيفك: "كيف حالك",
        شو: "ماذا",
        وين: "أين",
        كتير: "كثيراً",
        هيك: "هكذا",
        بدي: "أريد",
        عم: "أعمل",
        رح: "سوف",
        هلق: "الآن",
        مين: "مَن",
        ليش: "لماذا",
        "يا ريت": "أتمنى",
      },

      // الخليجية إلى الفصحى
      gulf_to_msa: {
        شلونك: "كيف حالك",
        شلون: "كيف",
        وين: "أين",
        شنو: "ماذا",
        وايد: "كثيراً",
        زين: "جيد",
        ابي: "أريد",
        اشراح: "ماذا",
        هني: "هنا",
        مكان: "أين",
        "يا ريت": "أتمنى",
        خوش: "جميل",
      },
    };

    // العكس - من الفصحى للهجات
    this.generateReverseMappings();
  }

  /**
   * Generate reverse mappings (MSA to dialects)
   */
  generateReverseMappings() {
    const dialects = ["iraqi", "egyptian", "levantine", "gulf"];

    dialects.forEach((dialect) => {
      const reversedKey = `msa_to_${dialect}`;
      const originalKey = `${dialect}_to_msa`;

      this.dialectMappings[reversedKey] = {};

      Object.entries(this.dialectMappings[originalKey]).forEach(
        ([dialectWord, msaWord]) => {
          this.dialectMappings[reversedKey][msaWord] = dialectWord;
        }
      );
    });
  }

  /**
   * Convert text between dialects
   * @param {string} text - النص المراد تحويله
   * @param {object} options - خيارات التحويل
   * @returns {string} النص المحول
   */
  convert(text, options = {}) {
    if (!text || typeof text !== "string") {
      return "";
    }

    const {
      from = "msa",
      to = "egyptian",
      preserveRTL = true,
      addRTLMarks = false,
    } = options;

    // التحقق من صحة اللهجات المدخلة
    const supportedDialects = ["msa", "iraqi", "egyptian", "levantine", "gulf"];

    if (!supportedDialects.includes(from) || !supportedDialects.includes(to)) {
      throw new Error(
        `Unsupported dialect. Supported: ${supportedDialects.join(", ")}`
      );
    }

    if (from === to) {
      return preserveRTL && addRTLMarks ? this.wrapWithRTL(text) : text;
    }

    const mappingKey = `${from}_to_${to}`;
    const mapping = this.dialectMappings[mappingKey];

    if (!mapping) {
      throw new Error(`Conversion from ${from} to ${to} is not supported yet`);
    }

    let convertedText = this.applyConversion(text, mapping);

    // إضافة علامات RTL إذا كان مطلوباً
    if (preserveRTL && addRTLMarks && this.isArabicText(convertedText)) {
      convertedText = this.wrapWithRTL(convertedText);
    }

    return convertedText;
  }

  /**
   * Apply word mappings to convert text
   * @param {string} text
   * @param {object} mapping
   * @returns {string}
   */
  applyConversion(text, mapping) {
    let convertedText = text;

    // ترتيب الكلمات حسب الطول (الأطول أولاً لتجنب التعارض)
    const sortedMappings = Object.entries(mapping).sort(
      ([a], [b]) => b.length - a.length
    );

    sortedMappings.forEach(([original, replacement]) => {
      // استخدام regex للبحث عن الكلمات الكاملة فقط
      const regex = new RegExp(`\\b${this.escapeRegex(original)}\\b`, "gi");
      convertedText = convertedText.replace(regex, replacement);
    });

    return convertedText;
  }

  /**
   * Escape special regex characters
   * @param {string} string
   * @returns {string}
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Get supported dialects
   * @returns {array}
   */
  getSupportedDialects() {
    return ["msa", "iraqi", "egyptian", "levantine", "gulf"];
  }

  /**
   * Get available conversions
   * @returns {array}
   */
  getAvailableConversions() {
    return Object.keys(this.dialectMappings).map((key) => {
      const [from, to] = key.split("_to_");
      return { from, to };
    });
  }

  /**
   * Add custom word mapping
   * @param {string} from - اللهجة المصدر
   * @param {string} to - اللهجة الهدف
   * @param {string} originalWord - الكلمة الأصلية
   * @param {string} translatedWord - الكلمة المترجمة
   */
  addCustomMapping(from, to, originalWord, translatedWord) {
    const mappingKey = `${from}_to_${to}`;

    if (!this.dialectMappings[mappingKey]) {
      this.dialectMappings[mappingKey] = {};
    }

    this.dialectMappings[mappingKey][originalWord] = translatedWord;
  }

  /**
   * Check if text contains Arabic characters
   * @param {string} text
   * @returns {boolean}
   */
  isArabicText(text) {
    if (!text || typeof text !== "string") return false;
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Wrap text with RTL directional marks
   * @param {string} text
   * @returns {string}
   */
  wrapWithRTL(text) {
    if (!text || typeof text !== "string") return "";
    return `\u202B${text}\u202C`; // RLE + text + PDF
  }

  /**
   * Get conversion statistics
   * @param {string} originalText
   * @param {string} convertedText
   * @param {string} from
   * @param {string} to
   * @returns {object}
   */
  getConversionStats(originalText, convertedText, from, to) {
    const originalWords = originalText.split(/\s+/).length;
    const convertedWords = convertedText.split(/\s+/).length;
    const changedChars = this.countChangedCharacters(
      originalText,
      convertedText
    );

    return {
      from,
      to,
      originalLength: originalText.length,
      convertedLength: convertedText.length,
      originalWords,
      convertedWords,
      changedCharacters: changedChars,
      conversionRatio:
        ((changedChars / originalText.length) * 100).toFixed(2) + "%",
      direction: "rtl", // Arabic text is always RTL
    };
  }

  /**
   * Count changed characters between original and converted text
   * @param {string} original
   * @param {string} converted
   * @returns {number}
   */
  countChangedCharacters(original, converted) {
    let changes = 0;
    const maxLength = Math.max(original.length, converted.length);

    for (let i = 0; i < maxLength; i++) {
      if (original[i] !== converted[i]) {
        changes++;
      }
    }

    return changes;
  }
}

const dialectConverter = new ArabicDialectConverter();

module.exports = dialectConverter;
module.exports.ArabicDialectConverter = ArabicDialectConverter;
