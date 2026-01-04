import { motion } from "framer-motion";
import { QrCode, Paintbrush, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import LanguageSelector from "../components/LanguageSelector";
import MonarchLogo from "../components/MonarchLogo";
import { t } from "../lib/translations";

export default function Homepg() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [username, setUsername] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const uname = localStorage.getItem('username');
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    setUserEmail(email);
    setUserName(name);
    setUsername(uname);
    setCurrentLang(lang);
    
    // Listen for language changes with smooth transition
    const handleLangChange = (e) => {
      const newLang = e.detail || localStorage.getItem('preferredLanguage') || 'en';
      // Use requestAnimationFrame for smooth update
      requestAnimationFrame(() => {
        setCurrentLang(newLang);
      });
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const getFeatures = () => [
    {
      icon: QrCode,
      title: t("Analyze Historic Artifacts", currentLang),
      description: t("Upload images of cave paintings, ancient scripts, artifacts, or historic artworks to discover their origins and meanings.", currentLang),
      gradient: "from-red-600 via-orange-600 to-amber-500",
      link: "/know-your-art"
    },
    {
      icon: Paintbrush,
      title: t("Generate Historic Art", currentLang),
      description: t("Create authentic prehistoric cave paintings, ancient scripts, hieroglyphics, or historic artifacts using AI.", currentLang),
      gradient: "from-orange-600 via-amber-500 to-yellow-600",
      link: "/typeprompt"
    },
    {
      icon: BookOpen,
      title: t("Historic Encyclopedia", currentLang),
      description: t("Search and explore ancient artifacts, cave art, historic scripts, and archaeological discoveries from museums worldwide.", currentLang),
      gradient: "from-amber-600 via-orange-500 to-red-600",
      link: "/encyclopedia"
    }
  ];
  
  const features = getFeatures();

  const FeatureCard = ({ icon: Icon, title, description, gradient, index, link }) => {
    const cardContent = (
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-stone-900/80 backdrop-blur-sm shadow-2xl hover:shadow-amber-900/40 transition-all duration-300 cursor-pointer border border-amber-900/30 will-change-transform h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Glowing Edge Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500`} />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-600/30 rounded-2xl transition-all duration-300" />
        
        {/* Content */}
        <div className="relative p-1.5 sm:p-8 flex flex-col items-center text-center space-y-1 sm:space-y-4">
          {/* Icon Container */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-9 h-9 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl relative`}
            style={{
              boxShadow: '0 0 30px rgba(217, 119, 6, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Icon className="w-5 h-5 sm:w-12 sm:h-12 text-amber-50" strokeWidth={2.5} />
            {/* Ancient glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
          
          {/* Title */}
          <h3 className="text-base sm:text-xl font-bold text-amber-100 group-hover:text-amber-50 transition-colors uppercase tracking-wide leading-tight">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-[12px] leading-tight sm:text-sm text-stone-400 sm:leading-relaxed">
            {description}
          </p>
          
          {/* Ancient arrow symbol */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 text-amber-700/50 group-hover:text-amber-500"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sm:w-6 sm:h-6"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
        
        {/* Cave painting style decorative marks */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-5 h-5 sm:w-8 sm:h-8 border-l-2 border-t-2 border-amber-800/40 rounded-tl-lg" />
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-5 h-5 sm:w-8 sm:h-8 border-r-2 border-b-2 border-amber-800/40 rounded-br-lg" />
      </motion.div>
    );

    return link ? <Link href={link}>{cardContent}</Link> : cardContent;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 relative overflow-hidden">
      {/* Ancient cave wall texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23654321' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23422918'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Animated fire/torch glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl will-change-transform"
        />
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl will-change-transform"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-2 py-1 sm:py-2 lg:py-4">
        {/* Top Bar with Language Selector and User Profile */}
        <div className="flex justify-end items-center gap-1 sm:gap-4 mb-1 sm:mb-2 flex-wrap">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* User Profile Section */}
          {userEmail && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm border border-amber-800/50 rounded-lg px-3 sm:px-4 py-2 text-amber-100 hover:border-amber-600 transition-colors"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">@{username || userName}</span>
                <span className="text-xs sm:hidden">{t("Profile", currentLang)}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-stone-900 border border-amber-800/50 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-amber-800/30">
                    <p className="text-xs text-stone-500">{t("Signed in as", currentLang)}</p>
                    <p className="text-sm text-amber-100 font-semibold">{userName}</p>
                    <p className="text-xs text-stone-400 truncate">@{username}</p>
                    <p className="text-xs text-stone-500 truncate mt-1">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-stone-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("Logout", currentLang)}</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        
          {/* Login/Register buttons if not logged in */}
          {!userEmail && (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-2 bg-stone-900/80 backdrop-blur-sm border border-amber-800/50 rounded-lg text-amber-100 hover:border-amber-600 transition-colors text-xs sm:text-sm"
                >
                  {t("Login", currentLang)}
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white font-semibold hover:from-amber-700 hover:to-orange-700 transition-colors text-xs sm:text-sm"
                >
                  {t("Register", currentLang)}
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Header */}
        <motion.div
          className="text-center -mb-6 sm:-mb-4"
        >
          <motion.div
            className="flex justify-center mb-0"
          >
            <MonarchLogo size="xl" className="h-[280px] lg:h-[420px]" />
          </motion.div>
          <motion.p
            className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 italic px-3 -mt-1 sm:-mt-2"
          >
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 max-w-7xl mx-auto mb-1 sm:mb-4 -mt-8 sm:-mt-4">
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                index={index}
                link={feature.link}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA with ancient symbols */}
        <motion.div
          className="text-center mt-4 sm:mt-8 space-y-4 hidden sm:block"
        >
          <div className="flex items-center justify-center gap-4 text-amber-800/50">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-amber-800/50" />
            <span className="text-2xl">◆</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-amber-800/50" />
          </div>
          <p className="text-stone-500 text-sm uppercase tracking-widest">
            {t("Choose Your Path", currentLang)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}