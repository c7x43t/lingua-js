use lingua::{Language, LanguageDetector, LanguageDetectorBuilder};
use neon::prelude::JsObject;
use neon::prelude::*;
use once_cell::sync::Lazy;
use once_cell::sync::OnceCell;
use std::collections::HashMap;
use std::fmt;
use std::hash::{Hash, Hasher};
use std::sync::RwLock;

struct DebuggableLanguageDetector(LanguageDetector);

impl DebuggableLanguageDetector {
    fn detect_language_of(&self, text: &str) -> Option<Language> {
        self.0.detect_language_of(text)
    }
    fn compute_language_confidence_values(&self, text: &str) -> Vec<(Language, f64)> {
        self.0.compute_language_confidence_values(text)
    }
    fn compute_normalized_language_confidence_values(&self, text: &str) -> Vec<(Language, f64)> {
        let confidence_values = self.compute_language_confidence_values(text);
        let sum: f64 = confidence_values
            .iter()
            .map(|(_, confidence)| confidence)
            .sum();

        confidence_values
            .into_iter()
            .map(|(language, confidence)| (language, confidence / sum))
            .collect()
    }
}

impl fmt::Debug for DebuggableLanguageDetector {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "LanguageDetector")
    }
}

type DetectorMap = HashMap<u64, OnceCell<DebuggableLanguageDetector>>;
static LANGUAGE_DETECTORS: Lazy<RwLock<DetectorMap>> =
    Lazy::new(|| RwLock::new(DetectorMap::new()));

fn get_language_detector_id(languages: Vec<String>) -> u64 {
    let mut languages_sorted = languages.clone();
    languages_sorted.sort();
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    languages_sorted.hash(&mut hasher);
    let id = hasher.finish();

    let mut detectors = LANGUAGE_DETECTORS.write().unwrap();
    if !detectors.contains_key(&id) {
        let languages_enum: Vec<Language> = languages
            .into_iter()
            .filter_map(|lang| lang.parse::<Language>().ok())
            .collect();
        let language_detector = DebuggableLanguageDetector(
            LanguageDetectorBuilder::from_languages(&languages_enum)
                .with_minimum_relative_distance(0.01)
                .build(),
        );
        let cell = OnceCell::new();
        cell.set(language_detector).unwrap();
        detectors.insert(id, cell);
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

fn detect_language(mut cx: FunctionContext) -> JsResult<JsString> {
    let input_text = cx.argument::<JsString>(0)?.value();
    let detector_id = cx.argument::<JsString>(1)?.value();
    let detector_id = detector_id.parse::<u64>().unwrap();
    let detectors = LANGUAGE_DETECTORS.read().unwrap();
    let detected_language = match detectors.get(&detector_id) {
        Some(cell) => cell
            .get()
            .expect("Failed to get language_detector")
            .detect_language_of(&input_text),
        None => None,
    };

    let result = match detected_language {
        Some(language) => format!("{:?}", language),
        None => String::new(),
    };
    Ok(cx.string(result))
}
fn detect_languages(mut cx: FunctionContext) -> JsResult<JsObject> {
    let input_text = cx.argument::<JsString>(0)?.value();
    let detector_id = cx.argument::<JsString>(1)?.value();
    let detector_id = detector_id.parse::<u64>().unwrap();

    let detectors = LANGUAGE_DETECTORS.read().unwrap();
    let confidence_values = match detectors.get(&detector_id) {
        Some(cell) => cell
            .get()
            .expect("Failed to get language_detector")
            .compute_language_confidence_values(&input_text),
        None => Vec::new(),
    };

    let result = cx.empty_object();
    for (language, confidence) in confidence_values {
        let language_key = cx.string(format!("{:?}", language));
        let confidence_value = cx.number(confidence);
        result.set(&mut cx, language_key, confidence_value)?;
    }

    Ok(result)
}
fn detect_languages_normalized(mut cx: FunctionContext) -> JsResult<JsObject> {
    let input_text = cx.argument::<JsString>(0)?.value();
    let detector_id = cx.argument::<JsString>(1)?.value();
    let detector_id = detector_id.parse::<u64>().unwrap();

    let detectors = LANGUAGE_DETECTORS.read().unwrap();
    let confidence_values = match detectors.get(&detector_id) {
        Some(cell) => cell
            .get()
            .expect("Failed to get language_detector")
            .compute_normalized_language_confidence_values(&input_text),
        None => Vec::new(),
    };

    let result = cx.empty_object();
    for (language, confidence) in confidence_values {
        let language_key = cx.string(format!("{:?}", language));
        let confidence_value = cx.number(confidence);
        result.set(&mut cx, language_key, confidence_value)?;
    }

    Ok(result)
}
register_module!(mut cx, {
    cx.export_function("getDetector", get_detector)?;
    cx.export_function("detectLanguage", detect_language)?;
    cx.export_function("detectLanguages", detect_languages)?;
    cx.export_function("detectLanguagesNormalized", detect_languages_normalized)
});
