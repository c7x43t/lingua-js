const path = require('path');
const { getLanguageDescriptor } = require('./language.js');

const nativeModulePath = path.join(__dirname, '../native');
const { detectLanguage: detectLanguage_, detectLanguages: detectLanguages_, detectLanguagesNormalized: detectLanguagesNormalized_, getDetector } = require(nativeModulePath);
// The list of languages used by lingua_rs
// Uses about 1G of memory
const LANGUAGES = ["Afrikaans", "Albanian", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", " Bokmal", "Bosnian", "Bulgarian", "Catalan", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish", "French", "Ganda", "Georgian", "German", "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Kazakh", "Korean", "Latin", "Latvian", "Lithuanian", "Macedonian", "Malay", "Maori", "Marathi", "Mongolian", "Nynorsk", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Serbian", "Shona", "Slovak", "Slovene", "Somali", "Sotho", "Spanish", "Swahili", "Swedish", "Tagalog", "Tamil", "Telugu", "Thai", "Tsonga", "Tswana", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh", "Xhosa", "Yoruba", "Zulu"]
class LanguageDetector {
  constructor(languages = LANGUAGES) {
    languages = languages.map(language => getLanguageDescriptor(language).lingua_name);
    this.languages = languages;
    this.detector_id = getDetector(languages);
  }
  static LANGUAGES = {
    "AFRIKAANS": "Afrikaans",
    "ALBANIAN": "Albanian",
    "ARABIC": "Arabic",
    "ARMENIAN": "Armenian",
    "AZERBAIJANI": "Azerbaijani",
    "BASQUE": "Basque",
    "BELARUSIAN": "Belarusian",
    "BENGALI": "Bengali",
    "BOKMAL": "Bokmal",
    "BOSNIAN": "Bosnian",
    "BULGARIAN": "Bulgarian",
    "CATALAN": "Catalan",
    "CHINESE": "Chinese",
    "CROATIAN": "Croatian",
    "CZECH": "Czech",
    "DANISH": "Danish",
    "DUTCH": "Dutch",
    "ENGLISH": "English",
    "ESPERANTO": "Esperanto",
    "ESTONIAN": "Estonian",
    "FINNISH": "Finnish",
    "FRENCH": "French",
    "GANDA": "Ganda",
    "GEORGIAN": "Georgian",
    "GERMAN": "German",
    "GREEK": "Greek",
    "GUJARATI": "Gujarati",
    "HEBREW": "Hebrew",
    "HINDI": "Hindi",
    "HUNGARIAN": "Hungarian",
    "ICELANDIC": "Icelandic",
    "INDONESIAN": "Indonesian",
    "IRISH": "Irish",
    "ITALIAN": "Italian",
    "JAPANESE": "Japanese",
    "KAZAKH": "Kazakh",
    "KOREAN": "Korean",
    "LATIN": "Latin",
    "LATVIAN": "Latvian",
    "LITHUANIAN": "Lithuanian",
    "MACEDONIAN": "Macedonian",
    "MALAY": "Malay",
    "MAORI": "Maori",
    "MARATHI": "Marathi",
    "MONGOLIAN": "Mongolian",
    "NYNORSK": "Nynorsk",
    "PERSIAN": "Persian",
    "POLISH": "Polish",
    "PORTUGUESE": "Portuguese",
    "PUNJABI": "Punjabi",
    "ROMANIAN": "Romanian",
    "RUSSIAN": "Russian",
    "SERBIAN": "Serbian",
    "SHONA": "Shona",
    "SLOVAK": "Slovak",
    "SLOVENE": "Slovene",
    "SOMALI": "Somali",
    "SOTHO": "Sotho",
    "SPANISH": "Spanish",
    "SWAHILI": "Swahili",
    "SWEDISH": "Swedish",
    "TAGALOG": "Tagalog",
    "TAMIL": "Tamil",
    "TELUGU": "Telugu",
    "THAI": "Thai",
    "TSONGA": "Tsonga",
    "TSWANA": "Tswana",
    "TURKISH": "Turkish",
    "UKRAINIAN": "Ukrainian",
    "URDU": "Urdu",
    "VIETNAMESE": "Vietnamese",
    "WELSH": "Welsh",
    "XHOSA": "Xhosa",
    "YORUBA": "Yoruba",
    "ZULU'": "Zulu"
  }
  // returns a single language as string according to lingua_rs
  detectLanguage(text) {
    return this.getLanguageDescriptor(detectLanguage_(text, this.detector_id));
  }
  // returns an object of detected languages with their respecitve scores
  detectLanguages(text) {
    return detectLanguages_(text, this.detector_id).map(detected => [this.getLanguageDescriptor(detected.language), detected.confidence]);
  }
  // returns an array of detected languages with normalized scores (sum of all scores is 1)
  detectLanguagesNormalized(text) {
    return detectLanguagesNormalized_(text, this.detector_id);
  }
  // returns the language descriptor for a given language code: {lingua_name: 'English', name: 'English', pt1: 'en', pt2t: 'eng', pt2b: 'eng', bt3: 'eng'}
  getLanguageDescriptor(code) {
    return getLanguageDescriptor(code);
  }
  // returns the language code for a given language name: 'English' -> 'en'
  detectLanguageCode(text) {
    return this.detectLanguage(text)?.pt1;
  }
  // returns the language codes for a given language name: 'English' -> ['en']
  detectLanguageCodes(text) {
    // return this.detectLanguages(text).map(language => )
    return detectLanguages_(text, this.detector_id).map(detected => [this.getLanguageDescriptor(detected.language)?.pt1, detected.confidence]);
  }

}
module.exports = LanguageDetector;

// async function main() {
//   // let languages = ['English', 'German']
//   let detector = new LanguageDetector();
//   let text = 'Mein Name ist herbert';
//   let detected_lang = detector.detectLanguageCodes(text);
//   console.log({ detectLanguages: detector.detectLanguages(text), detectLanguage: detector.detectLanguage(text), detectLanguageCode: detector.detectLanguageCode(text), detectLanguageCodes: detector.detectLanguageCodes(text) })
//   console.log({ detected_lang })
//   console.log({ detected_lang })

// }
// main();