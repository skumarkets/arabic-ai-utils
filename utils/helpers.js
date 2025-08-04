/**
 * Arabic Text Processing Helpers - مساعدات معالجة النصوص العربية
 * Common utilities and helper functions for Arabic text processing
 */

class ArabicHelpers {
  /**
   * Check if text contains Arabic characters
   * @param {string} text
   * @returns {boolean}
   */
  static isArabic(text) {
    if (!text || typeof text !== "string") return false;
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Check if text is entirely Arabic
   * @param {string} text
   * @returns {boolean}
   */
  static isFullyArabic(text) {
    if (!text || typeof text !== "string") return false;
    // إزالة المسافات والأرقام وعلامات الترقيم للفحص
    const arabicOnly = text.replace(
      /[\s\d\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/g,
      ""
    );
    return /^[\u0600-\u06FF]+$/.test(arabicOnly);
  }

  /**
   * Normalize Arabic text
   * @param {string} text
   * @returns {string}
   */
  static normalizeArabic(text) {
    if (!text || typeof text !== "string") return "";

    return (
      text
        // توحيد الألف
        .replace(/[إأآا]/g, "ا")
        // توحيد التاء المربوطة والهاء
        .replace(/ة/g, "ه")
        // توحيد الياء
        .replace(/ى/g, "ي")
        // إزالة التشكيل
        .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
        // تنظيم المسافات
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Count Arabic words in text
   * @param {string} text
   * @returns {number}
   */
  static countArabicWords(text) {
    if (!text || typeof text !== "string") return 0;

    const words = text
      .split(/\s+/)
      .filter((word) => word.length > 0 && this.isArabic(word));

    return words.length;
  }

  /**
   * Detect text direction (RTL for Arabic)
   * @param {string} text
   * @returns {string} 'rtl' or 'ltr'
   */
  static detectTextDirection(text) {
    if (!text || typeof text !== "string") return "ltr";

    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;

    return arabicChars > latinChars ? "rtl" : "ltr";
  }

  /**
   * Remove extra spaces and normalize whitespace
   * @param {string} text
   * @returns {string}
   */
  static normalizeSpaces(text) {
    if (!text || typeof text !== "string") return "";

    return text
      .replace(/[\r\n\t]/g, " ") // تحويل أحرف التحكم لمسافات
      .replace(/\s+/g, " ") // توحيد المسافات المتعددة
      .trim(); // إزالة المسافات من البداية والنهاية
  }

  /**
   * Split text into sentences (Arabic-aware)
   * @param {string} text
   * @returns {array}
   */
  static splitSentences(text) {
    if (!text || typeof text !== "string") return [];

    // تقسيم على أساس علامات الترقيم العربية والإنجليزية
    return text
      .split(/[.!?؟։۔]+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  /**
   * Get text statistics
   * @param {string} text
   * @returns {object}
   */
  static getTextStats(text) {
    if (!text || typeof text !== "string") {
      return {
        characters: 0,
        words: 0,
        arabicWords: 0,
        sentences: 0,
        direction: "ltr",
        hasArabic: false,
        isFullyArabic: false,
      };
    }

    const sentences = this.splitSentences(text);
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      words: words.length,
      arabicWords: this.countArabicWords(text),
      sentences: sentences.length,
      direction: this.detectTextDirection(text),
      hasArabic: this.isArabic(text),
      isFullyArabic: this.isFullyArabic(text),
    };
  }

  /**
   * Convert Arabic numerals to English numerals
   * @param {string} text
   * @returns {string}
   */
  static arabicToEnglishNumerals(text) {
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const englishNumerals = "0123456789";

    let result = text;
    for (let i = 0; i < arabicNumerals.length; i++) {
      result = result.replace(
        new RegExp(arabicNumerals[i], "g"),
        englishNumerals[i]
      );
    }

    return result;
  }

  /**
   * Convert English numerals to Arabic numerals
   * @param {string} text
   * @returns {string}
   */
  static englishToArabicNumerals(text) {
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const englishNumerals = "0123456789";

    let result = text;
    for (let i = 0; i < englishNumerals.length; i++) {
      result = result.replace(
        new RegExp(englishNumerals[i], "g"),
        arabicNumerals[i]
      );
    }

    return result;
  }

  /**
   * Remove all non-Arabic characters except spaces
   * @param {string} text
   * @returns {string}
   */
  static extractArabicOnly(text) {
    if (!text || typeof text !== "string") return "";

    return text
      .replace(/[^\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Validate Arabic text input
   * @param {string} text
   * @param {object} options
   * @returns {object}
   */
  static validateArabicText(text, options = {}) {
    const defaultOptions = {
      minLength: 1,
      maxLength: 1000,
      requireArabic: true,
      allowNumbers: true,
      allowEnglish: false,
    };

    const config = { ...defaultOptions, ...options };
    const errors = [];

    if (!text || typeof text !== "string") {
      errors.push("النص مطلوب ويجب أن يكون نص صالح");
      return { isValid: false, errors };
    }

    if (text.length < config.minLength) {
      errors.push(`النص قصير جداً، الحد الأدنى ${config.minLength} حرف`);
    }

    if (text.length > config.maxLength) {
      errors.push(`النص طويل جداً، الحد الأقصى ${config.maxLength} حرف`);
    }

    if (config.requireArabic && !this.isArabic(text)) {
      errors.push("النص يجب أن يحتوي على أحرف عربية");
    }

    if (!config.allowNumbers && /[0-9٠-٩]/.test(text)) {
      errors.push("الأرقام غير مسموحة في النص");
    }

    if (!config.allowEnglish && /[a-zA-Z]/.test(text)) {
      errors.push("الأحرف الإنجليزية غير مسموحة في النص");
    }

    return {
      isValid: errors.length === 0,
      errors,
      stats: this.getTextStats(text),
    };
  }

  /**
   * Format text for display (add proper spacing and direction)
   * @param {string} text
   * @param {object} options
   * @returns {string}
   */
  static formatForDisplay(text, options = {}) {
    if (!text || typeof text !== "string") return "";

    const { forceRTL = false, addRTLMarks = true } = options;
    const direction = forceRTL || this.detectTextDirection(text);
    const normalized = this.normalizeSpaces(text);

    // إضافة علامات اتجاه النص RTL للعربية
    if (addRTLMarks && (direction === "rtl" || forceRTL)) {
      return `\u202B${normalized}\u202C`; // RLE + text + PDF
    }

    return normalized;
  }

  /**
   * Wrap text in RTL direction marks
   * @param {string} text
   * @returns {string}
   */
  static wrapRTL(text) {
    if (!text || typeof text !== "string") return "";
    return `\u202B${text}\u202C`; // Right-to-Left Embedding + Pop Directional Formatting
  }

  /**
   * Wrap text in LTR direction marks
   * @param {string} text
   * @returns {string}
   */
  static wrapLTR(text) {
    if (!text || typeof text !== "string") return "";
    return `\u202A${text}\u202C`; // Left-to-Right Embedding + Pop Directional Formatting
  }

  /**
   * Clean directional marks from text
   * @param {string} text
   * @returns {string}
   */
  static cleanDirectionalMarks(text) {
    if (!text || typeof text !== "string") return "";
    // إزالة جميع علامات الاتجاه Unicode
    return text.replace(/[\u200E\u200F\u202A-\u202E]/g, "");
  }

  /**
   * Auto-format text with appropriate directional marks
   * @param {string} text
   * @returns {string}
   */
  static autoFormatDirection(text) {
    if (!text || typeof text !== "string") return "";

    const direction = this.detectTextDirection(text);
    return direction === "rtl" ? this.wrapRTL(text) : this.wrapLTR(text);
  }
}

module.exports = ArabicHelpers;
