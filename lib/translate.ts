// LibreTranslate API for free translation
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

// Cache to avoid repeated translations
const translationCache = new Map<string, string>();

export async function translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
  // Don't translate if target is English
  if (targetLang === 'en') return text;
  
  // Check cache
  const cacheKey = `${sourceLang}-${targetLang}-${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    
    if (data.translatedText) {
      // Cache the translation
      translationCache.set(cacheKey, data.translatedText);
      return data.translatedText;
    }
    
    return text; // Fallback to original
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original
  }
}

// Batch translation for multiple texts
export async function translateBatch(texts: string[], targetLang: string, sourceLang: string = 'en'): Promise<string[]> {
  if (targetLang === 'en') return texts;
  
  try {
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang, sourceLang))
    );
    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Fallback to originals
  }
}

// Get supported languages from LibreTranslate
export const LIBRETRANSLATE_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
  hi: 'हिन्दी',
  el: 'Ελληνικά',
  he: 'עברית',
  ru: 'Русский',
  ko: '한국어',
  tr: 'Türkçe',
  nl: 'Nederlands',
  pl: 'Polski',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
  no: 'Norsk',
  cs: 'Čeština',
  ro: 'Română',
  hu: 'Magyar',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  uk: 'Українська',
  bn: 'বাংলা',
  fa: 'فارسی',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  ur: 'اردو',
  sw: 'Kiswahili',
  az: 'Azərbaycanca',
  eu: 'Euskara',
  be: 'Беларуская',
  bg: 'Български',
  ca: 'Català',
  hr: 'Hrvatski',
  et: 'Eesti',
  gl: 'Galego',
  ka: 'ქართული',
  is: 'Íslenska',
  ga: 'Gaeilge',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  mk: 'Македонски',
  sr: 'Српски',
  sk: 'Slovenčina',
  sl: 'Slovenščina'
};
