/**
 * Arabic Text Cleaner - منظف النصوص العربية
 * Cleans Arabic text by removing diacritics, unwanted symbols, and formatting
 */

class ArabicTextCleaner {
  /**
   * Clean Arabic text from diacritics and unwanted characters
   * @param {string} text - النص المراد تنظيفه
   * @param {object} options - خيارات التنظيف
   * @returns {string} النص المنظف
   */
  clean(text, options = {}) {
    if (!text || typeof text !== "string") {
      return "";
    }

    const defaultOptions = {
      removeDiacritics: true, // إزالة التشكيل
      removeNumbers: false, // إزالة الأرقام
      removeSymbols: true, // إزالة الرموز
      removeEnglish: false, // إزالة الحروف الإنجليزية
      normalizeSpaces: true, // تنظيم المسافات
      preserveRTL: true, // الحفاظ على اتجاه RTL
      addRTLMarks: false, // إضافة علامات RTL
    };

    const config = { ...defaultOptions, ...options };
    let cleanedText = text;

    // إزالة التشكيل (الحركات)
    if (config.removeDiacritics) {
      cleanedText = this.removeDiacritics(cleanedText);
    }

    // إزالة الرموز غير المرغوبة
    if (config.removeSymbols) {
      cleanedText = this.removeSymbols(cleanedText);
    }

    // إزالة الأرقام
    if (config.removeNumbers) {
      cleanedText = this.removeNumbers(cleanedText);
    }

    // إزالة الحروف الإنجليزية
    if (config.removeEnglish) {
      cleanedText = this.removeEnglish(cleanedText);
    }

    // تنظيم المسافات
    if (config.normalizeSpaces) {
      cleanedText = this.normalizeSpaces(cleanedText);
    }

    // إضافة علامات RTL إذا كان مطلوباً
    if (config.addRTLMarks && this.isArabic(cleanedText)) {
      cleanedText = this.wrapWithRTL(cleanedText);
    }

    return cleanedText.trim();
  }

  /**
   * Remove Arabic diacritics (harakat)
   * @param {string} text
   * @returns {string}
   */
  removeDiacritics(text) {
    // Unicode ranges for Arabic diacritics
    return text.replace(/[\u064B-\u0652\u0670\u0640]/g, "");
  }

  /**
   * Remove unwanted symbols and punctuation
   * @param {string} text
   * @returns {string}
   */
  removeSymbols(text) {
    // Keep Arabic letters, numbers, spaces, and basic punctuation
    return text
      .replace(
        /[^\u0600-\u06FF\u0660-\u0669\s\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E0-9]/g,
        ""
      )
      .replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?~`]/g, "");
  }

  /**
   * Remove numbers
   * @param {string} text
   * @returns {string}
   */
  removeNumbers(text) {
    return text.replace(/[0-9٠-٩]/g, "");
  }

  /**
   * Remove English letters
   * @param {string} text
   * @returns {string}
   */
  removeEnglish(text) {
    return text.replace(/[a-zA-Z]/g, "");
  }

  /**
   * Normalize spaces and remove extra whitespace
   * @param {string} text
   * @returns {string}
   */
  normalizeSpaces(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  /**
   * Get text statistics after cleaning
   * @param {string} originalText
   * @param {string} cleanedText
   * @returns {object}
   */
  getCleaningStats(originalText, cleanedText) {
    return {
      originalLength: originalText.length,
      cleanedLength: cleanedText.length,
      removedCharacters: originalText.length - cleanedText.length,
      compressionRatio:
        (
          ((originalText.length - cleanedText.length) / originalText.length) *
          100
        ).toFixed(2) + "%",
      isArabic: this.isArabic(cleanedText),
      direction: this.detectTextDirection(cleanedText),
    };
  }

  /**
   * Check if text contains Arabic characters
   * @param {string} text
   * @returns {boolean}
   */
  isArabic(text) {
    if (!text || typeof text !== "string") return false;
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Detect text direction
   * @param {string} text
   * @returns {string} 'rtl' or 'ltr'
   */
  detectTextDirection(text) {
    if (!text || typeof text !== "string") return "ltr";

    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;

    return arabicChars > latinChars ? "rtl" : "ltr";
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
}

const textCleaner = new ArabicTextCleaner();

module.exports = textCleaner;
module.exports.ArabicTextCleaner = ArabicTextCleaner;
