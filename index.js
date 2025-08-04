/**
 * Arabic AI Utils - أدوات الذكاء الاصطناعي العربية
 * Open-source Arabic AI utilities for text processing and dialect conversion
 * 
 * @version 1.0.0
 * @author SKU Markets
 * @license ISC
 */

const textCleaner = require('./tools/text-cleaner');
const dialectConverter = require('./tools/dialect-converter');
const keywordExtractor = require('./tools/keyword-extractor');
const helpers = require('./utils/helpers');

module.exports = {
  textCleaner,
  dialectConverter,
  keywordExtractor,
  helpers,
  
  // Version info
  version: require('./package.json').version,
  
  // Quick access methods
  clean: textCleaner.clean,
  convert: dialectConverter.convert,
  extract: keywordExtractor.extract
};

// For CommonJS compatibility
module.exports.default = module.exports;
