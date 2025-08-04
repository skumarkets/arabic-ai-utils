/**
 * Jest Tests for Arabic Keyword Extractor
 * اختبارات Jest لمستخرج الكلمات المفتاحية العربية
 */

const { keywordExtractor } = require("../index");

describe("Arabic Keyword Extractor - مستخرج الكلمات المفتاحية العربية", () => {
  const sampleText =
    "الذكاء الاصطناعي يغير مستقبل العالم، ويساهم في تطوير حلول مبتكرة في مختلف المجالات التقنية والعلمية";

  describe("Basic Extraction - الاستخراج الأساسي", () => {
    test("should extract keywords from Arabic text", () => {
      const keywords = keywordExtractor.extract(sampleText);

      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords.length).toBeLessThanOrEqual(10); // default limit
    });

    test("should handle empty or invalid input", () => {
      expect(keywordExtractor.extract("")).toEqual([]);
      expect(keywordExtractor.extract(null)).toEqual([]);
      expect(keywordExtractor.extract(undefined)).toEqual([]);
    });

    test("should respect limit option", () => {
      const keywords = keywordExtractor.extract(sampleText, { limit: 3 });

      expect(keywords).toHaveLength(3);
    });
  });

  describe("Scoring Methods - طرق التسجيل", () => {
    test("should include scores when requested", () => {
      const keywords = keywordExtractor.extract(sampleText, {
        includeScore: true,
        limit: 5,
      });

      keywords.forEach((item) => {
        expect(item).toHaveProperty("word");
        expect(item).toHaveProperty("score");
        expect(item).toHaveProperty("frequency");
        expect(typeof item.score).toBe("number");
        expect(typeof item.frequency).toBe("number");
      });
    });

    test("should support different extraction methods", () => {
      const methods = ["tfidf", "frequency", "weighted"];

      methods.forEach((method) => {
        const keywords = keywordExtractor.extract(sampleText, {
          method,
          includeScore: true,
          limit: 3,
        });

        expect(keywords).toHaveLength(3);
        keywords.forEach((item) => {
          expect(item).toHaveProperty("score");
          expect(item.score).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("RTL Support - دعم RTL", () => {
    test("should add RTL marks to keywords when requested", () => {
      const keywords = keywordExtractor.extract(sampleText, {
        addRTLMarks: true,
        limit: 3,
      });

      keywords.forEach((keyword) => {
        expect(keyword).toContain("\u202B"); // RLE mark
        expect(keyword).toContain("\u202C"); // PDF mark
      });
    });
  });

  describe("Phrase Extraction - استخراج العبارات", () => {
    test("should extract phrases (n-grams)", () => {
      const phrases = keywordExtractor.extractPhrases(sampleText, {
        nGram: 2,
        limit: 5,
      });

      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.length).toBeLessThanOrEqual(5);

      phrases.forEach((phrase) => {
        expect(phrase).toHaveProperty("phrase");
        expect(phrase).toHaveProperty("frequency");
        expect(typeof phrase.phrase).toBe("string");
        expect(typeof phrase.frequency).toBe("number");
        expect(phrase.phrase.split(" ")).toHaveLength(2); // bi-gram
      });
    });

    test("should support different n-gram sizes", () => {
      const trigrams = keywordExtractor.extractPhrases(sampleText, {
        nGram: 3,
        limit: 3,
      });

      trigrams.forEach((phrase) => {
        expect(phrase.phrase.split(" ")).toHaveLength(3); // tri-gram
      });
    });
  });

  describe("Text Statistics - إحصائيات النص", () => {
    test("should return text statistics", () => {
      const stats = keywordExtractor.getTextStats(sampleText);

      expect(stats).toHaveProperty("totalWords");
      expect(stats).toHaveProperty("uniqueWords");
      expect(stats).toHaveProperty("avgWordLength");
      expect(stats).toHaveProperty("stopWordsRemoved");
      expect(stats).toHaveProperty("direction");
      expect(stats).toHaveProperty("isArabic");

      expect(typeof stats.totalWords).toBe("number");
      expect(typeof stats.uniqueWords).toBe("number");
      expect(typeof stats.avgWordLength).toBe("number");
      expect(typeof stats.stopWordsRemoved).toBe("number");
      expect(stats.direction).toBe("rtl");
      expect(stats.isArabic).toBe(true);
    });
  });

  describe("Text Processing - معالجة النص", () => {
    test("should clean text properly", () => {
      const textWithDiacritics = "الذَّكاءُ الاصْطِناعِيُّ";
      const cleanedText = keywordExtractor.cleanText(textWithDiacritics);

      expect(cleanedText).not.toContain("َ"); // Fatha
      expect(cleanedText).not.toContain("ُ"); // Damma
      expect(cleanedText).not.toContain("ْ"); // Sukun
      expect(cleanedText).not.toContain("ِ"); // Kasra
    });

    test("should tokenize text into words", () => {
      const words = keywordExtractor.tokenize("الذكاء الاصطناعي يغير العالم");

      expect(Array.isArray(words)).toBe(true);
      expect(words).toContain("الذكاء");
      expect(words).toContain("الاصطناعي");
      expect(words).toContain("يغير");
      expect(words).toContain("العالم");
    });

    test("should filter words correctly", () => {
      const words = ["الذكاء", "في", "من", "الاصطناعي", "هذا"];
      const filtered = keywordExtractor.filterWords(words, 2);

      expect(filtered).toContain("الذكاء");
      expect(filtered).toContain("الاصطناعي");
      expect(filtered).not.toContain("في"); // stop word
      expect(filtered).not.toContain("من"); // stop word
    });
  });

  describe("Helper Methods - الوظائف المساعدة", () => {
    test("should correctly identify Arabic text", () => {
      expect(keywordExtractor.isArabicText("نص عربي")).toBe(true);
      expect(keywordExtractor.isArabicText("English text")).toBe(false);
      expect(keywordExtractor.isArabicText("")).toBe(false);
    });

    test("should correctly detect text direction", () => {
      expect(keywordExtractor.detectTextDirection("نص عربي")).toBe("rtl");
      expect(keywordExtractor.detectTextDirection("English text")).toBe("ltr");
      expect(keywordExtractor.detectTextDirection("")).toBe("ltr");
    });

    test("should wrap text with RTL marks", () => {
      const text = "نص عربي";
      const wrapped = keywordExtractor.wrapWithRTL(text);

      expect(wrapped).toBe(`\u202B${text}\u202C`);
    });
  });

  describe("Edge Cases - الحالات الاستثنائية", () => {
    test("should handle short text", () => {
      const shortText = "نص قصير";
      const keywords = keywordExtractor.extract(shortText);

      expect(Array.isArray(keywords)).toBe(true);
    });

    test("should handle text with numbers and symbols", () => {
      const mixedText = "النص 123 مع رموز!@# وأرقام ٤٥٦";
      const keywords = keywordExtractor.extract(mixedText);

      expect(Array.isArray(keywords)).toBe(true);
    });

    test("should handle very long text", () => {
      const longText = sampleText.repeat(10);
      const keywords = keywordExtractor.extract(longText, { limit: 5 });

      expect(keywords).toHaveLength(5);
    });
  });
});
