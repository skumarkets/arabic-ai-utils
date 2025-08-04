/**
 * Jest Tests for Arabic Dialect Converter
 * اختبارات Jest لمحول اللهجات العربية
 */

const { dialectConverter } = require("../index");

describe("Arabic Dialect Converter - محول اللهجات العربية", () => {
  describe("Basic Conversion - التحويل الأساسي", () => {
    test("should convert Iraqi to MSA", () => {
      const iraqiText = "شلونك اليوم؟";
      const result = dialectConverter.convert(iraqiText, {
        from: "iraqi",
        to: "msa",
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    test("should return same text when from and to are identical", () => {
      const text = "كيف حالك؟";
      const result = dialectConverter.convert(text, { from: "msa", to: "msa" });

      expect(result).toBe(text);
    });

    test("should handle empty or invalid input", () => {
      expect(dialectConverter.convert("")).toBe("");
      expect(dialectConverter.convert(null)).toBe("");
      expect(dialectConverter.convert(undefined)).toBe("");
    });
  });

  describe("Supported Dialects - اللهجات المدعومة", () => {
    test("should return list of supported dialects", () => {
      const dialects = dialectConverter.getSupportedDialects();

      expect(Array.isArray(dialects)).toBe(true);
      expect(dialects).toContain("msa");
      expect(dialects).toContain("iraqi");
      expect(dialects).toContain("egyptian");
      expect(dialects).toContain("levantine");
      expect(dialects).toContain("gulf");
    });

    test("should throw error for unsupported dialect", () => {
      expect(() => {
        dialectConverter.convert("نص", { from: "unsupported", to: "msa" });
      }).toThrow();
    });
  });

  describe("RTL Support - دعم RTL", () => {
    test("should add RTL marks when requested", () => {
      const text = "شلونك؟";
      const result = dialectConverter.convert(text, {
        from: "iraqi",
        to: "msa",
        addRTLMarks: true,
      });

      expect(result).toContain("\u202B"); // RLE mark
      expect(result).toContain("\u202C"); // PDF mark
    });
  });

  describe("Conversion Statistics - إحصائيات التحويل", () => {
    test("should return conversion statistics", () => {
      const originalText = "شلونك اليوم؟";
      const convertedText = dialectConverter.convert(originalText, {
        from: "iraqi",
        to: "msa",
      });
      const stats = dialectConverter.getConversionStats(
        originalText,
        convertedText,
        "iraqi",
        "msa"
      );

      expect(stats).toHaveProperty("from", "iraqi");
      expect(stats).toHaveProperty("to", "msa");
      expect(stats).toHaveProperty("originalLength");
      expect(stats).toHaveProperty("convertedLength");
      expect(stats).toHaveProperty("originalWords");
      expect(stats).toHaveProperty("convertedWords");
      expect(stats).toHaveProperty("changedCharacters");
      expect(stats).toHaveProperty("conversionRatio");
      expect(stats).toHaveProperty("direction", "rtl");
    });
  });

  describe("Custom Mappings - الخرائط المخصصة", () => {
    test("should allow adding custom word mappings", () => {
      dialectConverter.addCustomMapping("test", "msa", "تيست", "اختبار");

      // This test mainly checks that the method doesn't throw
      expect(() => {
        dialectConverter.addCustomMapping("test", "msa", "كلمة", "word");
      }).not.toThrow();
    });
  });

  describe("Available Conversions - التحويلات المتاحة", () => {
    test("should return available conversion pairs", () => {
      const conversions = dialectConverter.getAvailableConversions();

      expect(Array.isArray(conversions)).toBe(true);
      expect(conversions.length).toBeGreaterThan(0);

      conversions.forEach((conversion) => {
        expect(conversion).toHaveProperty("from");
        expect(conversion).toHaveProperty("to");
      });
    });
  });

  describe("Helper Methods - الوظائف المساعدة", () => {
    test("should correctly identify Arabic text", () => {
      expect(dialectConverter.isArabicText("نص عربي")).toBe(true);
      expect(dialectConverter.isArabicText("English text")).toBe(false);
      expect(dialectConverter.isArabicText("")).toBe(false);
    });

    test("should wrap text with RTL marks", () => {
      const text = "نص عربي";
      const wrapped = dialectConverter.wrapWithRTL(text);

      expect(wrapped).toBe(`\u202B${text}\u202C`);
    });

    test("should count changed characters correctly", () => {
      const original = "شلونك";
      const converted = "كيفك";
      const changes = dialectConverter.countChangedCharacters(
        original,
        converted
      );

      expect(typeof changes).toBe("number");
      expect(changes).toBeGreaterThanOrEqual(0);
    });
  });
});
