const { detectLanguage: detectLanguage_, detectLanguages: detectLanguages_, detectLanguagesNormalized: detectLanguagesNormalized_, getDetector } = require('../native');

// async function main() {
//     let languages = ['English', 'German']
//     let detector_id = getDetector(languages);
//     let text = 'Mein Name ist herbert';
//     let detected_lang = detectLanguage(text, detector_id);
//     console.log({ detected_lang })

// }
// main();
const LANGUAGES = ["Afrikaans", "Albanian", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", " Bokmal", "Bosnian", "Bulgarian", "Catalan", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish", "French", "Ganda", "Georgian", "German", "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Kazakh", "Korean", "Latin", "Latvian", "Lithuanian", "Macedonian", "Malay", "Maori", "Marathi", "Mongolian", "Nynorsk", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Serbian", "Shona", "Slovak", "Slovene", "Somali", "Sotho", "Spanish", "Swahili", "Swedish", "Tagalog", "Tamil", "Telugu", "Thai", "Tsonga", "Tswana", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh", "Xhosa", "Yoruba", "Zulu"]
class LanguageDetector {
    constructor(languages = LANGUAGES) {
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
    detectLanguage(text) {
        return detectLanguage_(text, this.detector_id);
    }
    detectLanguages(text) {
        return detectLanguages_(text, this.detector_id);
    }
    detectLanguagesNormalized(text) {
        return detectLanguagesNormalized_(text, this.detector_id);
    }
}
module.exports = LanguageDetector;