import { useState } from "react";
import { motion } from "framer-motion";
import {
  Paintbrush,
  Sparkles,
  Download,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function TypePrompt() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate-cave-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image generation failed");
      }

      // ✅ MUST match backend key
      setImageUrl(data.imageUrl);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `cave-painting-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Generate Cave Painting · Monarch</title>
        <meta name="description" content="AI-generated prehistoric cave art" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 relative overflow-hidden">
        {/* Torch glow */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"
        />

        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Back */}
          <Link href="/homepg">
            <button className="flex items-center gap-2 text-amber-100 mb-6 sm:mb-8 text-sm sm:text-base hover:text-amber-50 transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Home
            </button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center">
                <Paintbrush className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl text-amber-100 font-bold mb-3 sm:mb-4 uppercase leading-tight px-2">
              Historic Art Generator
            </h1>
            <p className="text-stone-400 italic text-xs sm:text-base px-4">
              Generate authentic cave paintings, ancient scripts, hieroglyphics, or historic artifacts with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="max-w-3xl mx-auto mb-8 sm:mb-10">
            <label className="flex items-center gap-2 text-amber-100 mb-3 sm:mb-3 uppercase text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Describe Your Historic Creation
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              rows={5}
              placeholder="Examples:&#10;• Cave painting of hunters chasing mammoths in Lascaux style&#10;• Ancient Egyptian hieroglyphics depicting daily life&#10;• Greek amphora with mythological scenes&#10;• Mesopotamian cuneiform tablet with trade records"
              className="w-full p-4 sm:p-4 rounded-xl bg-neutral-950 text-stone-200 border border-amber-800 focus:border-amber-500 focus:outline-none mb-5 sm:mb-6 text-sm sm:text-base"
            />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-bold uppercase flex justify-center items-center gap-2 text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Generate
                </>
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="max-w-3xl mx-auto text-red-400 mb-6 sm:mb-6 text-sm sm:text-base px-2">
              ⚠ {error}
            </div>
          )}

          {/* Result */}
          {imageUrl && (
            <div className="max-w-3xl mx-auto bg-stone-900 p-4 sm:p-6 rounded-xl border border-amber-800">
              <img
                src={imageUrl}
                alt="Generated cave art"
                className="w-full rounded-lg mb-5 sm:mb-6"
              />

              <button
                onClick={handleDownload}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex justify-center items-center gap-2 transition-colors text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
