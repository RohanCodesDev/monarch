import { motion } from "framer-motion";
import { QrCode, Paintbrush, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LanguageSelector from "../components/LanguageSelector";

export default function Homepg() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [username, setUsername] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    const uname = localStorage.getItem('username');
    setUserEmail(email);
    setUserName(name);
    setUsername(uname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const features = [
    {
      icon: QrCode,
      title: "Analyze Historic Artifacts",
      description: "Upload images of cave paintings, ancient scripts, artifacts, or historic artworks to discover their origins and meanings.",
      gradient: "from-red-600 via-orange-600 to-amber-500",
      link: "/know-your-art"
    },
    {
      icon: Paintbrush,
      title: "Generate Historic Art",
      description: "Create authentic prehistoric cave paintings, ancient scripts, hieroglyphics, or historic artifacts using AI.",
      gradient: "from-orange-600 via-amber-500 to-yellow-600",
      link: "/typeprompt"
    },
    {
      icon: BookOpen,
      title: "Historic Encyclopedia",
      description: "Search and explore ancient artifacts, cave art, historic scripts, and archaeological discoveries from museums worldwide.",
      gradient: "from-amber-600 via-orange-500 to-red-600",
      link: "/encyclopedia"
    }
  ];

  const FeatureCard = ({ icon: Icon, title, description, gradient, index, link }) => {
    const cardContent = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-stone-900/80 backdrop-blur-sm shadow-2xl hover:shadow-amber-900/40 transition-all duration-300 cursor-pointer border border-amber-900/30 will-change-transform"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* Glowing Edge Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500`} />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-600/30 rounded-2xl transition-all duration-300" />
        
        {/* Content */}
        <div className="relative p-8 flex flex-col items-center text-center space-y-4">
          {/* Icon Container */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-24 h-24 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl relative`}
            style={{
              boxShadow: '0 0 30px rgba(217, 119, 6, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Icon className="w-12 h-12 text-amber-50" strokeWidth={2.5} />
            {/* Ancient glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-50 transition-colors uppercase tracking-wide">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-stone-400 text-sm leading-relaxed">
            {description}
          </p>
          
          {/* Ancient arrow symbol */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="absolute bottom-6 right-6 text-amber-700/50 group-hover:text-amber-500"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
        
        {/* Cave painting style decorative marks */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-800/40 rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-800/40 rounded-br-lg" />
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
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        {/* Top Bar with Language Selector and User Profile */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* User Profile Section */}
          {userEmail && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm border border-amber-800/50 rounded-lg px-4 py-2 text-amber-100 hover:border-amber-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">@{username || userName}</span>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-stone-900 border border-amber-800/50 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="p-3 border-b border-amber-800/30">
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="text-sm text-amber-100 font-semibold">{userName}</p>
                    <p className="text-xs text-stone-400 truncate">@{username}</p>
                    <p className="text-xs text-stone-500 truncate mt-1">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-stone-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Login/Register buttons if not logged in */}
        {!userEmail && (
          <div className="absolute top-8 right-8 flex gap-3">
            <LanguageSelector />
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-stone-900/80 backdrop-blur-sm border border-amber-800/50 rounded-lg text-amber-100 hover:border-amber-600 transition-colors"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white font-semibold hover:from-amber-700 hover:to-orange-700 transition-colors"
              >
                Register
              </motion.button>
            </Link>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl lg:text-7xl font-bold text-amber-100 mb-6 uppercase tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              textShadow: '0 0 40px rgba(217, 119, 6, 0.5), 0 0 20px rgba(0, 0, 0, 0.8)'
            }}
          >
            Monarch - Historic Artifacts
          </motion.h1>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.p
            className="text-lg text-stone-400 max-w-2xl mx-auto italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover prehistoric cave paintings, ancient scripts, artifacts, and archaeological treasures. 
            AI-powered analysis to decode humanity's earliest stories and civilizations.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-4 text-amber-800/50">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-amber-800/50" />
            <span className="text-2xl">◆</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-amber-800/50" />
          </div>
          <p className="text-stone-500 text-sm uppercase tracking-widest">
            Choose Your Path
          </p>
        </motion.div>
      </div>
    </div>
  );
}