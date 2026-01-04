import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Globe, ArrowLeft } from 'lucide-react';
import MonarchLogo from '../components/MonarchLogo';

export default function About() {
  return (
    <>
      <Head>
        <title>About · Monarch</title>
        <meta name="description" content="Learn about Monarch - Historic Artifacts Explorer powered by AI" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 relative overflow-hidden">
        {/* Ancient texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23654321' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Glowing effect */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
          {/* Back Button */}
          <Link href="/homepg">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-amber-100 mb-8 hover:text-amber-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <MonarchLogo size="xl" />
            </div>
            <h1 className="text-5xl md:text-6xl text-amber-100 font-bold mb-4 uppercase">
              About Monarch
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
            <p className="text-xl text-stone-400 italic">
              Exploring Ancient History Through Modern Technology
            </p>
          </motion.div>

          {/* Content Cards */}
          <div className="space-y-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/30 rounded-xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-amber-100 font-bold mb-3">Our Mission</h2>
                  <p className="text-stone-400 leading-relaxed">
                    Monarch is dedicated to making ancient history and archaeological discoveries accessible to everyone. 
                    Using cutting-edge AI technology, we help you analyze cave paintings, decipher ancient scripts, 
                    and explore historic artifacts from civilizations across the globe.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/30 rounded-xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-amber-100 font-bold mb-3">What We Offer</h2>
                  <div className="space-y-3 text-stone-400">
                    <p className="leading-relaxed">
                      <strong className="text-amber-300">• AI-Powered Analysis:</strong> Upload images of historic artifacts and receive detailed analysis about their origins, 
                      cultural significance, and historical context.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-amber-300">• Art Generation:</strong> Create authentic prehistoric cave art, ancient scripts, and historic artifacts using advanced AI models.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-amber-300">• Museum Encyclopedia:</strong> Search through millions of artifacts from world-renowned museums including 
                      The Metropolitan Museum of Art, Art Institute of Chicago, and Rijksmuseum.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/30 rounded-xl p-6 md:p-8"
            >
              <h2 className="text-2xl text-amber-100 font-bold mb-4">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-400">
                <div>
                  <p className="text-amber-300 font-semibold mb-2">Frontend</p>
                  <p className="text-sm">Next.js 14 · React 18 · TypeScript · Tailwind CSS · Framer Motion</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold mb-2">Backend</p>
                  <p className="text-sm">Next.js API Routes · Prisma · PostgreSQL · Nodemailer</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold mb-2">AI & APIs</p>
                  <p className="text-sm">OpenAI GPT-4 Vision · Google Gemini · Replicate · Black Forest Labs</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold mb-2">Museums</p>
                  <p className="text-sm">Met Museum API · Art Institute of Chicago · Rijksmuseum</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Link href="/homepg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-bold uppercase hover:from-amber-700 hover:to-orange-700 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Start Exploring
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center text-stone-500 mt-16 text-sm"
          >
            Built with Next.js 14 · React 18 · Pages Router · Powered by AI
          </motion.p>
        </div>
      </div>
    </>
  );
}
