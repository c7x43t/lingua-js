# lang-detect


A simple wrapper around the rust library [lingua-rs](https://github.com/pemistahl/lingua-rs).


Using lingua-rs 1.5.0


Simple usage:



    // accepts an array of languages, either as names or as iso codes (any iso code 1, 2t, 2b, or 3)
    // Be careful as a detector instance uses up a lot of ram ~ 1Gb for all 76 languages
    let detector = new LanguageDetector(); 
    let text = 'Some Text';
    detector.detectLanguage(text); // {lingua_name: 'English', name: 'English', pt1: 'en', pt2t: 'eng', pt2b: 'eng', bt3: 'eng'}
    detector.detectLanguageCode(text); // returns ISO 639-1 Code: 'en'
    detector.detectLanguages(text); // sorted array with [{language: {lingua_name: 'English', name: 'English', pt1: 'en', pt2t: 'eng', pt2b: 'eng', bt3: 'eng'}, confidence: 0.13395527374612717}]
    detector.detectLanguageCodes(text); // sorted array with [{language: 'en', confidence: 0.13395527374612717}]

Iso codes: [List_of_ISO_639-1_codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)