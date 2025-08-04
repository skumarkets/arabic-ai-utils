/**
 * Jest Tests for Arabic Text Cleaner
 * اختبارات Jest لمنظف النصوص العربية
 */

const { textCleaner } = require("../index");

describe("Arabic Text Cleaner - منظف النصوص العربية", () => {
  describe("Basic Cleaning - التنظيف الأساسي", () => {
    test("should clean Arabic text with default options", () => {
      const dirtyText = "فيه رموز ٪٪ وأرقام 123 ونقاط غير ضرورية!";
      const result = textCleaner.clean(dirtyText);

      expect(result).toBeDefined();
      expect(result).not.toBe(dirtyText);
      expect(result.length).toBeLessThan(dirtyText.length);
    });

    test("should handle empty or invalid input", () => {
      expect(textCleaner.clean("")).toBe("");
      expect(textCleaner.clean(null)).toBe("");
      expect(textCleaner.clean(undefined)).toBe("");
      expect(textCleaner.clean(123)).toBe("");
    });

    test("should remove diacritics by default", () => {
      const textWithDiacritics = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";
      const result = textCleaner.clean(textWithDiacritics);

      expect(result).not.toContain("ِ"); // Kasra
      expect(result).not.toContain("ْ"); // Sukun
      expect(result).not.toContain("َ"); // Fatha
      expect(result).toContain("بسم"); // Should contain base letters
    });
  });

  describe("Custom Options - الخيارات المخصصة", () => {
    test("should preserve numbers when removeNumbers is false", () => {
      const textWithNumbers = "النص يحتوي على رقم 123 و ٤٥٦";
      const result = textCleaner.clean(textWithNumbers, {
        removeNumbers: false,
      });

      expect(result).toContain("123");
      expect(result).toContain("٤٥٦");
    });

    test("should remove numbers when removeNumbers is true", () => {
      const textWithNumbers = "النص يحتوي على رقم 123 و ٤٥٦";
      const result = textCleaner.clean(textWithNumbers, {
        removeNumbers: true,
      });

      expect(result).not.toContain("123");
      expect(result).not.toContain("٤٥٦");
    });

    test("should add RTL marks when addRTLMarks is true", () => {
      const arabicText = "نص عربي";
      const result = textCleaner.clean(arabicText, { addRTLMarks: true });

      expect(result).toContain("\u202B"); // RLE mark
      expect(result).toContain("\u202C"); // PDF mark
    });

    test("should remove English when removeEnglish is true", () => {
      const mixedText = "نص عربي مع English text";
      const result = textCleaner.clean(mixedText, { removeEnglish: true });

      expect(result).not.toContain("English");
      expect(result).not.toContain("text");
      expect(result).toContain("نص");
      expect(result).toContain("عربي");
    });
  });

  describe("Text Statistics - إحصائيات النص", () => {
    test("should return correct cleaning statistics", () => {
      const originalText = "نص مع رموز!!! ومسافات   زائدة";
      const cleanedText = textCleaner.clean(originalText);
      const stats = textCleaner.getCleaningStats(originalText, cleanedText);

      expect(stats).toHaveProperty("originalLength");
      expect(stats).toHaveProperty("cleanedLength");
      expect(stats).toHaveProperty("removedCharacters");
      expect(stats).toHaveProperty("compressionRatio");
      expect(stats).toHaveProperty("isArabic");
      expect(stats).toHaveProperty("direction");

      expect(stats.originalLength).toBe(originalText.length);
      expect(stats.cleanedLength).toBe(cleanedText.length);
      expect(stats.isArabic).toBe(true);
      expect(stats.direction).toBe("rtl");
    });
  });

  describe("Helper Methods - الوظائف المساعدة", () => {
    test("should correctly identify Arabic text", () => {
      expect(textCleaner.isArabic("نص عربي")).toBe(true);
      expect(textCleaner.isArabic("English text")).toBe(false);
      expect(textCleaner.isArabic("نص مختلط English")).toBe(true);
      expect(textCleaner.isArabic("")).toBe(false);
    });

    test("should correctly detect text direction", () => {
      expect(textCleaner.detectTextDirection("نص عربي")).toBe("rtl");
      expect(textCleaner.detectTextDirection("English text")).toBe("ltr");
      expect(textCleaner.detectTextDirection("نص عربي أكثر English")).toBe(
        "rtl"
      );
      expect(textCleaner.detectTextDirection("")).toBe("ltr");
    });

    test("should wrap text with RTL marks", () => {
      const text = "نص عربي";
      const wrapped = textCleaner.wrapWithRTL(text);

      expect(wrapped).toBe(`\u202B${text}\u202C`);
      expect(textCleaner.wrapWithRTL("")).toBe("");
    });
  });

  describe("Edge Cases - الحالات الاستثنائية", () => {
    test("should handle very long text", () => {
      const longText = "نص عربي طويل جداً ".repeat(1000);
      const result = textCleaner.clean(longText);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("should handle text with only symbols", () => {
      const symbolsOnly = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const result = textCleaner.clean(symbolsOnly);

      expect(result.length).toBeLessThanOrEqual(symbolsOnly.length);
    });

    test("should handle mixed RTL/LTR content", () => {
      const mixedText = "نص عربي English نص آخر";
      const result = textCleaner.clean(mixedText);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
