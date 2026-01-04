import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translateText } from '../lib/translate';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => Promise<string>;
  tSync: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: async (text) => text,
  tSync: (text) => text,
});

export const useTranslation = () => useContext(TranslationContext);

// Simple in-memory cache for synchronous translations
const syncCache = new Map<string, string>();

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLang);
  }, []);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    syncCache.clear(); // Clear cache when language changes
  };

  // Async translation function
  const t = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'en') return text;
    
    const cacheKey = `${currentLanguage}-${text}`;
    if (syncCache.has(cacheKey)) {
      return syncCache.get(cacheKey)!;
    }

    const translated = await translateText(text, currentLanguage);
    syncCache.set(cacheKey, translated);
    return translated;
  };

  // Synchronous translation (returns cached or original)
  const tSync = (text: string): string => {
    if (!text || currentLanguage === 'en') return text;
    
    const cacheKey = `${currentLanguage}-${text}`;
    
    // Return cached if available
    if (syncCache.has(cacheKey)) {
      return syncCache.get(cacheKey)!;
    }
    
    // Trigger async translation in background
    translateText(text, currentLanguage).then(translated => {
      syncCache.set(cacheKey, translated);
    });
    
    // Return original for now
    return text;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t, tSync }}>
      {children}
    </TranslationContext.Provider>
  );
}
