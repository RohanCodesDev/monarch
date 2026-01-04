import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { LIBRETRANSLATE_LANGUAGES } from '../lib/translate';

const SUPPORTED_LANGUAGES = LIBRETRANSLATE_LANGUAGES;

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setIsOpen(false);
    
    // Trigger translation update event (no reload needed)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: langCode }));
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
      >
        <Languages size={20} />
        <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES]}</span>
        <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                  <motion.button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between ${
                      currentLanguage === code ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{name}</span>
                    {currentLanguage === code && (
                      <span className="text-orange-600">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
