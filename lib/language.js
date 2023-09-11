// languages.json contains a mapping from lingua_rs to https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const fs = require('fs');
const path = require('path');

class Language {
  constructor({
    lingua_name,
    name,
    pt1,
    pt2t,
    pt2b,
    pt3,
    native_name
  }) {
    this.lingua_name = lingua_name;
    this.name = name;
    this.pt1 = pt1;
    this.pt2t = pt2t;
    this.pt2b = pt2b;
    this.pt3 = pt3;
    this.native_name = native_name;
    // Make the properties of this instance immutable
    Object.freeze(this);
  }
}
// structure: 
// {lingua_name: 'English', name: 'English', pt1: 'en', pt2t: 'eng', pt2b: 'eng', bt3: 'eng'}
const languagesJsonPath = path.join(__dirname, './languages.json');
const languagesJson = JSON.parse(fs.readFileSync(languagesJsonPath, 'utf8'));
const languages = languagesJson.map(language => new Language(language));
const languageMap = new Map();
for (let language of languages) {
  for (let key of Object.keys(language)) {
    language[key] instanceof Array ? language[key].forEach(fragment => languageMap.set(fragment, language)) : languageMap.set(language[key], language);
  }
}
// console.log(languageMap);
function getLanguageDescriptor(code) {
  return languageMap.get(code);
}
module.exports = { getLanguageDescriptor };