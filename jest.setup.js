/**
 * Jest Setup File
 * ملف إعداد Jest للاختبارات
 */

// Set timezone for consistent test results
process.env.TZ = "UTC";

// Arabic text samples for testing
global.ARABIC_TEST_SAMPLES = {
  simple: "نص عربي",
  withDiacritics: "النَّصُّ العَرَبِيُّ",
  mixed: "نص عربي مع English",
  withNumbers: "نص مع أرقام ١٢٣",
  long: "هذا نص عربي طويل يحتوي على كلمات كثيرة ومتنوعة لاختبار وظائف المكتبة المختلفة",
  dialects: {
    iraqi: "شلونك اليوم؟",
    egyptian: "إزيك النهاردة؟",
    levantine: "كيفك اليوم؟",
    gulf: "شلونك اليوم؟",
  },
};

// RTL test markers
global.RTL_MARKS = {
  RLE: "\u202B", // Right-to-Left Embedding
  PDF: "\u202C", // Pop Directional Formatting
  LRE: "\u202A", // Left-to-Right Embedding
};

// Custom matchers for Arabic text testing
expect.extend({
  toBeArabicText(received) {
    const arabicRegex = /[\u0600-\u06FF]/;
    const pass = arabicRegex.test(received);

    if (pass) {
      return {
        message: () =>
          `expected "${received}" not to contain Arabic characters`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to contain Arabic characters`,
        pass: false,
      };
    }
  },

  toHaveRTLMarks(received) {
    const hasRLE = received.includes("\u202B");
    const hasPDF = received.includes("\u202C");
    const pass = hasRLE && hasPDF;

    if (pass) {
      return {
        message: () => `expected "${received}" not to have RTL marks`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to have RTL marks (RLE and PDF)`,
        pass: false,
      };
    }
  },

  toBeValidKeywordArray(received) {
    const isArray = Array.isArray(received);
    const hasValidItems = received.every(
      (item) =>
        typeof item === "string" ||
        (typeof item === "object" &&
          item.word &&
          typeof item.score === "number")
    );
    const pass = isArray && hasValidItems;

    if (pass) {
      return {
        message: () => `expected array not to be valid keyword array`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected array to be valid keyword array with strings or {word, score} objects`,
        pass: false,
      };
    }
  },
});

// Console logging for test debugging
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (process.env.NODE_ENV === "test" && process.env.JEST_VERBOSE !== "true") {
    return;
  }
  originalConsoleLog.apply(console, args);
};

// Test utilities
global.testUtils = {
  // Generate random Arabic text for testing
  generateArabicText: (length = 10) => {
    const arabicChars = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += arabicChars.charAt(
        Math.floor(Math.random() * arabicChars.length)
      );
    }
    return result;
  },

  // Remove RTL marks for comparison
  cleanRTLMarks: (text) => {
    return text.replace(/[\u202A-\u202E]/g, "");
  },
};
