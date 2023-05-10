use neon::prelude::*;
use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::hash::{Hash, Hasher};
use std::sync::Mutex;

static LANGUAGE_DETECTORS: Lazy<Mutex<HashMap<u64, LanguageDetector>>> = Lazy::new(|| Mutex::new(HashMap::new));

fn get_language_detector_id(languages: Vec<String>) -> u64 {
    let mut languages_sorted = languages.clone();
    languages_sorted.sort();
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    languages_sorted.hash(&mut hasher);
    let id = hasher.finish();

    let mut language_detectors = LANGUAGE_DETECTORS.lock().unwrap();
    
    if !language_detectors.contains_key(&id) {
        let languages_enum: Vec<Language> = languages
            .into_iter()
            .filter_map(|lang| lang.parse::<Language>().ok())
            .collect();
        let language_detector = LanguageDetectorBuilder::from_languages(&languages_enum)
            .with_minimum_relative_distance(0.01)
            .build();
        language_detectors.insert(id, language_detector);
    }

    id
}

fn get_detector(mut cx: FunctionContext) -> JsResult<JsString> {
    let languages = cx.argument::<JsArray>(0)?.to_vec(&mut cx)?;
    let languages: Vec<String> = languages
        .into_iter()
        .map(|lang| lang.downcast::<JsString>().unwrap().value())
        .collect();

    let id = get_language_detector_id(languages);
    Ok(cx.string(format!("{}", id)))
}

fn hello_world(mut cx: FunctionContext) -> JsResult<JsString> {
    let input_text = cx.argument::<JsString>(0)?.value();
    let detector_id = cx.argument::<JsString>(1)?.value();
    let detector_id = detector_id.parse::<u64>().unwrap();

    let detected_language = {
        let language_detectors = LANGUAGE_DETECTORS.lock().unwrap();
        match language_detectors.get(&detector_id) {
            Some(detector) => detector.detect_language_of(input_text),
            None => None,
        }
    };

    let result = match detected_language {
        Some(language) => format!("{:?}", language),
        None => String::new(),
    };
    Ok(cx.string(result))
}

register_module!(mut cx, {
    cx.export_function("getDetector", get_detector)?;
    cx.export_function("helloWorld", hello_world)
});