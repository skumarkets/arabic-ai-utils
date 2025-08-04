/**
 * Arabic Keyword Extractor - مستخرج الكلمات المفتاحية العربية
 * Extracts important keywords and phrases from Arabic text
 */

class ArabicKeywordExtractor {
  constructor() {
    // كلمات التوقف العربية
    this.stopWords = new Set([
      "في",
      "من",
      "إلى",
      "على",
      "عن",
      "مع",
      "أن",
      "هذا",
      "هذه",
      "ذلك",
      "تلك",
      "التي",
      "الذي",
      "كان",
      "كانت",
      "يكون",
      "تكون",
      "هو",
      "هي",
      "أو",
      "لا",
      "نعم",
      "كل",
      "بعض",
      "جميع",
      "كما",
      "لكن",
      "غير",
      "سوف",
      "قد",
      "لقد",
      "أم",
      "أما",
      "إما",
      "كيف",
      "متى",
      "أين",
      "ماذا",
      "لماذا",
      "أي",
      "أية",
      "هل",
      "بل",
      "لم",
      "لن",
      "ما",
      "مع",
      "عند",
      "لدى",
      "حول",
      "دون",
      "ضد",
      "أثناء",
      "خلال",
      "بعد",
      "قبل",
      "أمام",
      "خلف",
      "فوق",
      "تحت",
      "يمين",
      "يسار",
      "داخل",
      "خارج",
      "بين",
      "أمس",
      "اليوم",
      "غداً",
      "هنا",
      "هناك",
      "حيث",
    ]);

    // أوزان مختلفة لأهمية الكلمات
    this.weights = {
      length: 0.3, // وزن طول الكلمة
      frequency: 0.4, // وزن تكرار الكلمة
      position: 0.3, // وزن موقع الكلمة في النص
    };
  }

  /**
   * Extract keywords from Arabic text
   * @param {string} text - النص المراد استخراج الكلمات منه
   * @param {object} options - خيارات الاستخراج
   * @returns {array} مصفوفة الكلمات المفتاحية
   */
  extract(text, options = {}) {
    if (!text || typeof text !== "string") {
      return [];
    }

    const defaultOptions = {
      limit: 10, // عدد الكلمات المستخرجة
      minLength: 2, // الحد الأدنى لطول الكلمة
      includeScore: false, // تضمين النقاط
      method: "tfidf", // طريقة الاستخراج
      preserveRTL: true, // الحفاظ على اتجاه RTL
      addRTLMarks: false, // إضافة علامات RTL للكلمات
    };

    const config = { ...defaultOptions, ...options };

    // تنظيف النص
    const cleanedText = this.cleanText(text);

    // استخراج الكلمات
    const words = this.tokenize(cleanedText);

    // فلترة الكلمات
    const filteredWords = this.filterWords(words, config.minLength);

    // حساب الأهمية
    const scoredWords = this.calculateScores(filteredWords, config.method);

    // ترتيب وتحديد العدد
    let sortedWords = scoredWords
      .sort((a, b) => b.score - a.score)
      .slice(0, config.limit);

    // إضافة علامات RTL للكلمات إذا كان مطلوباً
    if (config.addRTLMarks) {
      sortedWords = sortedWords.map((item) => ({
        ...item,
        word: this.wrapWithRTL(item.word),
      }));
    }

    // إرجاع النتيجة حسب التفضيل
    return config.includeScore
      ? sortedWords
      : sortedWords.map((item) => item.word);
  }

  /**
   * Clean and normalize text
   * @param {string} text
   * @returns {string}
   */
  cleanText(text) {
    return (
      text
        // إزالة التشكيل
        .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
        // إزالة الرموز والأرقام
        .replace(/[^\u0600-\u06FF\s]/g, " ")
        // تنظيم المسافات
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Tokenize text into words
   * @param {string} text
   * @returns {array}
   */
  tokenize(text) {
    return text.split(/\s+/).filter((word) => word.length > 0);
  }

  /**
   * Filter words (remove stop words and short words)
   * @param {array} words
   * @param {number} minLength
   * @returns {array}
   */
  filterWords(words, minLength) {
    return words.filter(
      (word) =>
        word.length >= minLength &&
        !this.stopWords.has(word) &&
        /[\u0600-\u06FF]/.test(word) // يحتوي على حروف عربية
    );
  }

  /**
   * Calculate word importance scores
   * @param {array} words
   * @param {string} method
   * @returns {array}
   */
  calculateScores(words, method = "tfidf") {
    const wordFreq = this.calculateFrequency(words);
    const wordPositions = this.calculatePositions(words);

    const scoredWords = [];

    for (const [word, freq] of Object.entries(wordFreq)) {
      let score = 0;

      switch (method) {
        case "tfidf":
          score = this.calculateTfIdf(
            word,
            freq,
            words.length,
            wordPositions[word]
          );
          break;
        case "frequency":
          score = freq;
          break;
        case "weighted":
          score = this.calculateWeightedScore(
            word,
            freq,
            wordPositions[word],
            words.length
          );
          break;
        default:
          score = freq;
      }

      scoredWords.push({ word, score, frequency: freq });
    }

    return scoredWords;
  }

  /**
   * Calculate word frequency
   * @param {array} words
   * @returns {object}
   */
  calculateFrequency(words) {
    const freq = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
  }

  /**
   * Calculate average positions of words
   * @param {array} words
   * @returns {object}
   */
  calculatePositions(words) {
    const positions = {};
    words.forEach((word, index) => {
      if (!positions[word]) {
        positions[word] = [];
      }
      positions[word].push(index);
    });

    // حساب متوسط المواقع
    for (const word in positions) {
      const avgPosition =
        positions[word].reduce((sum, pos) => sum + pos, 0) /
        positions[word].length;
      positions[word] = avgPosition;
    }

    return positions;
  }

  /**
   * Calculate TF-IDF score (simplified version)
   * @param {string} word
   * @param {number} frequency
   * @param {number} totalWords
   * @param {number} position
   * @returns {number}
   */
  calculateTfIdf(word, frequency, totalWords, position) {
    const tf = frequency / totalWords;
    const positionWeight = 1 - position / totalWords; // الكلمات في البداية أهم
    const lengthWeight = Math.min(word.length / 10, 1); // الكلمات الأطول أهم

    return tf * positionWeight * lengthWeight * 100;
  }

  /**
   * Calculate weighted score based on multiple factors
   * @param {string} word
   * @param {number} frequency
   * @param {number} position
   * @param {number} totalWords
   * @returns {number}
   */
  calculateWeightedScore(word, frequency, position, totalWords) {
    const lengthScore = Math.min(word.length / 10, 1) * this.weights.length;
    const frequencyScore = (frequency / totalWords) * this.weights.frequency;
    const positionScore = (1 - position / totalWords) * this.weights.position;

    return (lengthScore + frequencyScore + positionScore) * 100;
  }

  /**
   * Extract phrases (n-grams) from text
   * @param {string} text
   * @param {object} options
   * @returns {array}
   */
  extractPhrases(text, options = {}) {
    const { nGram = 2, limit = 5 } = options;

    const words = this.tokenize(this.cleanText(text));
    const filteredWords = this.filterWords(words, 2);

    const phrases = [];

    for (let i = 0; i <= filteredWords.length - nGram; i++) {
      const phrase = filteredWords.slice(i, i + nGram).join(" ");
      phrases.push(phrase);
    }

    const phraseFreq = this.calculateFrequency(phrases);

    return Object.entries(phraseFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([phrase, freq]) => ({ phrase, frequency: freq }));
  }

  /**
   * Get text statistics
   * @param {string} text
   * @returns {object}
   */
  getTextStats(text) {
    const words = this.tokenize(this.cleanText(text));
    const filteredWords = this.filterWords(words, 1);
    const uniqueWords = new Set(filteredWords);

    return {
      totalWords: words.length,
      uniqueWords: uniqueWords.size,
      avgWordLength:
        words.reduce((sum, word) => sum + word.length, 0) / words.length,
      stopWordsRemoved: words.length - filteredWords.length,
      direction: this.detectTextDirection(text),
      isArabic: this.isArabicText(text),
    };
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

const keywordExtractor = new ArabicKeywordExtractor();

module.exports = keywordExtractor;
module.exports.ArabicKeywordExtractor = ArabicKeywordExtractor;
