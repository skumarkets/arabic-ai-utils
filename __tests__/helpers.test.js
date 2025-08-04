/**
 * Jest Tests for Arabic Helpers
 * اختبارات Jest للمساعدات العربية
 */

const { helpers } = require("../index");

describe("Arabic Helpers - المساعدات العربية", () => {
  describe("Text Detection - اكتشاف النص", () => {
    test("should correctly identify Arabic text", () => {
      expect(helpers.isArabic("نص عربي")).toBe(true);
      expect(helpers.isArabic("English text")).toBe(false);
      expect(helpers.isArabic("نص مختلط English")).toBe(true);
      expect(helpers.isArabic("")).toBe(false);
      expect(helpers.isArabic(null)).toBe(false);
      expect(helpers.isArabic(undefined)).toBe(false);
    });

    test("should correctly identify fully Arabic text", () => {
      expect(helpers.isFullyArabic("نص عربي بالكامل")).toBe(true);
      expect(helpers.isFullyArabic("نص مختلط English")).toBe(false);
      expect(helpers.isFullyArabic("English only")).toBe(false);
      expect(helpers.isFullyArabic("")).toBe(false);
    });

    test("should correctly detect text direction", () => {
      expect(helpers.detectTextDirection("نص عربي")).toBe("rtl");
      expect(helpers.detectTextDirection("English text")).toBe("ltr");
      expect(helpers.detectTextDirection("نص عربي أكثر English")).toBe("rtl");
      expect(helpers.detectTextDirection("English more Arabic نص")).toBe("ltr");
      expect(helpers.detectTextDirection("")).toBe("ltr");
    });
  });

  describe("Text Normalization - تطبيع النص", () => {
    test("should normalize Arabic text", () => {
      const text = "أهلاً وسهلاً بكة";
      const normalized = helpers.normalizeArabic(text);

      expect(normalized).toContain("اهلا"); // normalized alef
      expect(normalized).toContain("وسهلا"); // normalized alef
      expect(normalized).toContain("بكه"); // normalized teh marbuta
    });

    test("should normalize spaces correctly", () => {
      const text = "  نص  مع   مسافات     كثيرة  ";
      const normalized = helpers.normalizeSpaces(text);

      expect(normalized).toBe("نص مع مسافات كثيرة");
      expect(normalized.startsWith(" ")).toBe(false);
      expect(normalized.endsWith(" ")).toBe(false);
    });
  });

  describe("Word Counting - عد الكلمات", () => {
    test("should count Arabic words correctly", () => {
      expect(helpers.countArabicWords("نص عربي جميل")).toBe(3);
      expect(helpers.countArabicWords("نص عربي English text")).toBe(2);
      expect(helpers.countArabicWords("English only text")).toBe(0);
      expect(helpers.countArabicWords("")).toBe(0);
    });
  });

  describe("Text Statistics - إحصائيات النص", () => {
    test("should return comprehensive text statistics", () => {
      const text = "نص عربي مع English و أرقام ١٢٣";
      const stats = helpers.getTextStats(text);

      expect(stats).toHaveProperty("characters");
      expect(stats).toHaveProperty("charactersNoSpaces");
      expect(stats).toHaveProperty("words");
      expect(stats).toHaveProperty("arabicWords");
      expect(stats).toHaveProperty("sentences");
      expect(stats).toHaveProperty("direction");
      expect(stats).toHaveProperty("hasArabic");
      expect(stats).toHaveProperty("isFullyArabic");

      expect(stats.characters).toBe(text.length);
      expect(stats.charactersNoSpaces).toBe(text.replace(/\s/g, "").length);
      expect(stats.hasArabic).toBe(true);
      expect(stats.isFullyArabic).toBe(false);
      expect(stats.direction).toBe("rtl");
    });

    test("should handle empty text statistics", () => {
      const stats = helpers.getTextStats("");

      expect(stats.characters).toBe(0);
      expect(stats.words).toBe(0);
      expect(stats.arabicWords).toBe(0);
      expect(stats.sentences).toBe(0);
      expect(stats.direction).toBe("ltr");
      expect(stats.hasArabic).toBe(false);
      expect(stats.isFullyArabic).toBe(false);
    });
  });

  describe("Number Conversion - تحويل الأرقام", () => {
    test("should convert Arabic numerals to English", () => {
      expect(helpers.arabicToEnglishNumerals("السعر ١٢٣٤ ريال")).toBe(
        "السعر 1234 ريال"
      );
      expect(helpers.arabicToEnglishNumerals("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
      expect(helpers.arabicToEnglishNumerals("نص بدون أرقام")).toBe(
        "نص بدون أرقام"
      );
    });

    test("should convert English numerals to Arabic", () => {
      expect(helpers.englishToArabicNumerals("Price 1234 SAR")).toBe(
        "Price ١٢٣٤ SAR"
      );
      expect(helpers.englishToArabicNumerals("0123456789")).toBe("٠١٢٣٤٥٦٧٨٩");
      expect(helpers.englishToArabicNumerals("Text without numbers")).toBe(
        "Text without numbers"
      );
    });
  });

  describe("Text Extraction - استخراج النص", () => {
    test("should extract Arabic-only text", () => {
      const mixedText = "نص عربي English text ١٢٣ numbers";
      const arabicOnly = helpers.extractArabicOnly(mixedText);

      expect(arabicOnly).toContain("نص عربي");
      expect(arabicOnly).not.toContain("English");
      expect(arabicOnly).not.toContain("text");
      expect(arabicOnly).not.toContain("123");
      expect(arabicOnly).not.toContain("numbers");
    });
  });

  describe("Text Validation - التحقق من النص", () => {
    test("should validate Arabic text with default options", () => {
      const validation = helpers.validateArabicText("نص عربي صالح");

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.stats).toHaveProperty("characters");
    });

    test("should reject non-Arabic text when required", () => {
      const validation = helpers.validateArabicText("English only text", {
        requireArabic: true,
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(
        validation.errors.some((error) => error.includes("أحرف عربية"))
      ).toBe(true);
    });

    test("should reject text that is too short", () => {
      const validation = helpers.validateArabicText("قصير", {
        minLength: 10,
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((error) => error.includes("قصير"))).toBe(
        true
      );
    });

    test("should reject text that is too long", () => {
      const longText = "نص طويل جداً ".repeat(100);
      const validation = helpers.validateArabicText(longText, {
        maxLength: 50,
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((error) => error.includes("طويل"))).toBe(
        true
      );
    });

    test("should reject English when not allowed", () => {
      const validation = helpers.validateArabicText("نص مع English", {
        allowEnglish: false,
      });

      expect(validation.isValid).toBe(false);
      expect(
        validation.errors.some((error) => error.includes("الإنجليزية"))
      ).toBe(true);
    });

    test("should reject numbers when not allowed", () => {
      const validation = helpers.validateArabicText("نص مع ١٢٣", {
        allowNumbers: false,
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((error) => error.includes("الأرقام"))).toBe(
        true
      );
    });
  });

  describe("RTL Support - دعم RTL", () => {
    test("should wrap text with RTL marks", () => {
      const text = "نص عربي";
      const wrapped = helpers.wrapRTL(text);

      expect(wrapped).toBe(`\u202B${text}\u202C`);
      expect(helpers.wrapRTL("")).toBe("");
    });

    test("should wrap text with LTR marks", () => {
      const text = "English text";
      const wrapped = helpers.wrapLTR(text);

      expect(wrapped).toBe(`\u202A${text}\u202C`);
      expect(helpers.wrapLTR("")).toBe("");
    });

    test("should clean directional marks", () => {
      const textWithMarks = "\u202Bنص عربي\u202C مع \u202AEnglish\u202C";
      const cleaned = helpers.cleanDirectionalMarks(textWithMarks);

      expect(cleaned).not.toContain("\u202B");
      expect(cleaned).not.toContain("\u202C");
      expect(cleaned).not.toContain("\u202A");
      expect(cleaned).toContain("نص عربي");
      expect(cleaned).toContain("English");
    });

    test("should auto-format text direction", () => {
      const arabicText = "نص عربي";
      const englishText = "English text";

      const arabicFormatted = helpers.autoFormatDirection(arabicText);
      const englishFormatted = helpers.autoFormatDirection(englishText);

      expect(arabicFormatted).toContain("\u202B"); // RTL
      expect(englishFormatted).toContain("\u202A"); // LTR
    });

    test("should format text for display with options", () => {
      const text = "نص عربي";

      const formatted = helpers.formatForDisplay(text, {
        forceRTL: true,
        addRTLMarks: true,
      });

      expect(formatted).toContain("\u202B");
      expect(formatted).toContain("\u202C");
    });
  });

  describe("Sentence Splitting - تقسيم الجمل", () => {
    test("should split text into sentences", () => {
      const text = "هذه جملة أولى. وهذه جملة ثانية! وهذه ثالثة؟";
      const sentences = helpers.splitSentences(text);

      expect(Array.isArray(sentences)).toBe(true);
      expect(sentences).toHaveLength(3);
      expect(sentences[0]).toContain("أولى");
      expect(sentences[1]).toContain("ثانية");
      expect(sentences[2]).toContain("ثالثة");
    });

    test("should handle empty text", () => {
      expect(helpers.splitSentences("")).toEqual([]);
      expect(helpers.splitSentences(null)).toEqual([]);
    });
  });
});
