use neon::prelude::*;
use lingua::LanguageDetectorBuilder;
// use lingua::Language::{Afrikaans,Albanian,Arabic,Armenian,Azerbaijani,Basque,Belarusian,Bengali, Bokmal,Bosnian,Bulgarian,Catalan,Chinese,Croatian,Czech,Danish,Dutch,English,Esperanto,Estonian,Finnish,French,Ganda,Georgian,German,Greek,Gujarati,Hebrew,Hindi,Hungarian,Icelandic,Indonesian,Irish,Italian,Japanese,Kazakh,Korean,Latin,Latvian,Lithuanian,Macedonian,Malay,Maori,Marathi,Mongolian,Nynorsk,Persian,Polish,Portuguese,Punjabi,Romanian,Russian,Serbian,Shona,Slovak,Slovene,Somali,Sotho,Spanish,Swahili,Swedish,Tagalog,Tamil,Telugu,Thai,Tsonga,Tswana,Turkish,Ukrainian,Urdu,Vietnamese,Welsh,Xhosa,Yoruba,Zulu};
use lingua::Language::{English,French,German,Italian,Portuguese,Spanish};
use once_cell::sync::Lazy;

static LANGUAGE_DETECTOR: Lazy<lingua::LanguageDetector> = Lazy::new(|| {
    LanguageDetectorBuilder::from_languages(&[English,French,German,Italian,Portuguese,Spanish])
        .with_minimum_relative_distance(0.01) // minimum: 0.00 maximum: 0.99 default: 0.00
        .build()
});
fn hello_world(mut cx: FunctionContext) -> JsResult<JsString> {
    let input_text = cx.argument::<JsString>(0)?.value();
    let detected_language = LANGUAGE_DETECTOR.detect_language_of(input_text);
    // Ok(cx.string(format!("{:?}", detected_language)))
    let result = match detected_language {
        Some(language) => format!("{:?}", language),
        None => String::new(),
    };
    Ok(cx.string(result))
}

register_module!(mut cx, {
    cx.export_function("helloWorld", hello_world)
});