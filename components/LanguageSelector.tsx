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
    <div className="relative z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg backdrop-blur-sm"
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
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border border-amber-500/20 overflow-hidden z-[101]"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                maxHeight: '384px',
                background: 'rgba(23, 23, 23, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600/50 scrollbar-track-stone-900/50">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                  <motion.button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    whileHover={{ x: 4, backgroundColor: 'rgba(217, 119, 6, 0.15)' }}
                    transition={{ duration: 0.15 }}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between border-b border-stone-800/50 last:border-0 ${
                      currentLanguage === code 
                        ? 'bg-amber-600/20 text-amber-400 font-semibold' 
                        : 'text-stone-200 hover:text-amber-300'
                    }`}
                  >
                    <span>{name}</span>
                    {currentLanguage === code && (
                      <span className="text-amber-500">✓</span>
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
