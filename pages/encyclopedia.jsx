import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, ExternalLink, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { t } from "../lib/translations";

export default function Encyclopedia() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  
  useEffect(() => {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLang(lang);
    
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Get user's language preference
      const userLang = localStorage.getItem('preferredLanguage') || 'en';
      const response = await fetch(`/api/artworks/search?query=${encodeURIComponent(searchQuery)}&lang=${userLang}`);
      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (error) {
      console.error("Error searching artworks:", error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Historic Encyclopedia · Monarch</title>
        <meta name="description" content="Search and explore ancient artifacts, cave art, historic scripts, and archaeological discoveries" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 relative overflow-hidden">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl"
        />

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Back Button */}
          <Link href="/homepg">
            <button className="flex items-center gap-2 text-amber-100 mb-8 hover:text-amber-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              {t("Back to Home", currentLang)}
            </button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl text-amber-100 font-bold mb-4 uppercase">
              {t("Historic Artifacts Encyclopedia", currentLang)}
            </h1>
            <p className="text-stone-400 italic">
              {t("Search ancient artifacts, cave art, historic scripts, and archaeological discoveries from museums worldwide", currentLang)}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for cave paintings, ancient artifacts, hieroglyphics, pottery, sculptures, historic scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-5 rounded-xl bg-stone-900/80 border-2 border-amber-800 text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold transition-all disabled:opacity-50"
              >
                {loading ? t("Searching...", currentLang) : t("Search", currentLang)}
              </button>
            </div>
          </form>

          {/* Data Sources Info */}
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Searching: Wikipedia, The Met, Art Institute of Chicago, Rijksmuseum & more
            </p>
          </div>

          {/* Results Count */}
          {searched && !loading && (
            <div className="max-w-6xl mx-auto mb-6 text-stone-400">
              Found {artworks.length} artworks for "{searchQuery}"
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center text-amber-100 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <p className="mt-4">{t("Loading data...", currentLang)}</p>
            </div>
          )}

          {/* Welcome State */}
          {!searched && !loading && (
            <div className="text-center py-20 max-w-2xl mx-auto">
              <BookOpen className="w-20 h-20 text-amber-600 mx-auto mb-6" />
              <h2 className="text-2xl text-amber-100 font-bold mb-4">
                {t("Discover Ancient History & Artifacts", currentLang)}
              </h2>
              <p className="text-stone-400 mb-8">
                Search through millions of ancient artifacts, cave paintings, historic scripts, and archaeological discoveries from Wikipedia and prestigious museums including
                The Metropolitan Museum of Art, Art Institute of Chicago, and Rijksmuseum.
                Get instant access to artifact details, historical context, and external
                resources for deeper learning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-stone-900/50 p-4 rounded-lg border border-amber-900/30">
                  <h3 className="text-amber-300 font-semibold mb-2">Ancient Artifacts</h3>
                  <p className="text-stone-500 text-sm">
                    Cave paintings, pottery, sculptures, tools, and ceremonial objects
                  </p>
                </div>
                <div className="bg-stone-900/50 p-4 rounded-lg border border-amber-900/30">
                  <h3 className="text-amber-300 font-semibold mb-2">Historic Scripts</h3>
                  <p className="text-stone-500 text-sm">
                    Hieroglyphics, cuneiform, runes, ancient manuscripts, and inscriptions
                  </p>
                </div>
                <div className="bg-stone-900/50 p-4 rounded-lg border border-amber-900/30">
                  <h3 className="text-amber-300 font-semibold mb-2">Learn & Explore</h3>
                  <p className="text-stone-500 text-sm">
                    Access Wikipedia links and museum resources for detailed archaeological study
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {searched && !loading && artworks.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-stone-600 mx-auto mb-4" />
              <p className="text-stone-400 text-lg">No historic artifacts found for "{searchQuery}"</p>
              <p className="text-stone-500 mt-2">
                Try keywords like: cave paintings, hieroglyphics, ancient pottery, cuneiform, artifacts, archaeological finds
              </p>
            </div>
          )}

          {/* Artworks Grid */}
          {!loading && artworks.length > 0 && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group bg-stone-900/80 rounded-xl border border-amber-800 overflow-hidden hover:border-amber-500 transition-all hover:shadow-xl hover:shadow-amber-900/30"
                >
                  {/* Image */}
                  {artwork.imageUrl && (
                    <div className="relative h-56 overflow-hidden bg-stone-950">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Source Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-xs text-amber-300 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {artwork.source}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-100 mb-2 line-clamp-2">
                      {artwork.title}
                    </h3>
                    
                    {/* Wikipedia Extract */}
                    {artwork.extract && (
                      <p className="text-stone-400 text-sm mb-4 leading-relaxed">
                        {artwork.extract}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-amber-300 text-sm font-semibold">
                        {artwork.artist}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
                        <div>
                          <span className="text-stone-500">Date:</span> {artwork.date}
                        </div>
                        <div>
                          <span className="text-stone-500">Origin:</span> {artwork.origin}
                        </div>
                        <div className="col-span-2">
                          <span className="text-stone-500">Medium:</span> {artwork.medium}
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-900/50 text-amber-200 text-xs">
                        {artwork.category}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="space-y-2 border-t border-stone-800 pt-4">
                      {artwork.links.details && (
                        <a
                          href={artwork.links.details}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {artwork.source === 'Wikipedia' ? 'Read Full Article on Wikipedia' : 'View in Museum Collection'}
                        </a>
                      )}
                      {artwork.links.artistWiki && artwork.source !== 'Wikipedia' && (
                        <a
                          href={artwork.links.artistWiki}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Learn about Artist (Wikipedia)
                        </a>
                      )}
                      {artwork.links.categoryWiki && artwork.source !== 'Wikipedia' && (
                        <a
                          href={artwork.links.categoryWiki}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          About {artwork.category} (Wikipedia)
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
