import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function KnowYourArt() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(true);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShowOptions(false);
      };
      reader.readAsDataURL(file);
      setError(null);
      setAnalysis(null);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/analyze-art", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);

      // Auto-save to database (always)
      try {
        // Get userId from localStorage (or use 'anonymous' as fallback)
        const userId = typeof window !== 'undefined' 
          ? localStorage.getItem('userId') || 'anonymous'
          : 'anonymous';

        await fetch("/api/artworks/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Historic Artifact Analysis",
            artist: "Unknown",
            description: data.analysis.substring(0, 500),
            imageUrl: imagePreview,
            analysis: data.analysis,
            userId: userId,
            isFavorite: false,
            artifactType: "analyzed_artifact",
            civilization: "Unknown",
          }),
        });
        console.log("✓ Historic artifact auto-saved to database");
      } catch (saveError) {
        console.error("Failed to auto-save:", saveError);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setShowOptions(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <>
      <Head>
        <title>Analyze Historic Artifacts · Monarch</title>
        <meta name="description" content="AI-powered analysis for cave paintings, ancient scripts, artifacts, and historic art" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-900 relative overflow-hidden">
        {/* Torch glow */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"
        />

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Back Button */}
          <Link href="/homepg">
            <button className="flex items-center gap-2 text-amber-100 mb-8 hover:text-amber-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 via-orange-600 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-5xl text-amber-100 font-bold mb-4 uppercase">
              Analyze Historic Artifacts
            </h1>
            <p className="text-stone-400 italic">
              Upload cave paintings, ancient scripts, artifacts, or historic art for AI-powered analysis
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl mx-auto">
            {showOptions && !imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              >
                {/* Upload Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadClick}
                  className="p-8 rounded-xl bg-stone-900/80 border-2 border-amber-800 hover:border-amber-500 transition-all group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-100 uppercase">
                      Upload from Device
                    </h3>
                    <p className="text-stone-400 text-sm text-center">
                      Choose an image from your gallery or files
                    </p>
                  </div>
                </motion.button>

                {/* Camera Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCameraClick}
                  className="p-8 rounded-xl bg-stone-900/80 border-2 border-amber-800 hover:border-amber-500 transition-all group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-100 uppercase">
                      Take a Picture
                    </h3>
                    <p className="text-stone-400 text-sm text-center">
                      Capture an artwork with your camera
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10"
              >
                <div className="relative bg-stone-900 p-6 rounded-xl border border-amber-800">
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <img
                    src={imagePreview}
                    alt="Selected artwork"
                    className="w-full rounded-lg mb-6"
                  />
                  
                  {!analysis && !loading && (
                    <button
                      onClick={handleAnalyze}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white font-bold uppercase flex justify-center items-center gap-2 hover:shadow-lg transition-shadow"
                    >
                      <Sparkles className="w-5 h-5" />
                      Analyze Artwork
                    </button>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center gap-3 py-4 text-amber-100">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing your artwork...
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-600 text-red-200"
              >
                ⚠ {error}
              </motion.div>
            )}

            {/* Analysis Result */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stone-900/80 rounded-xl border border-amber-800 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 p-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white uppercase">
                      Artwork Analysis
                    </h2>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    {analysis.split('\n\n').map((section, index) => {
                      // Helper function to convert markdown links to clickable links
                      const parseMarkdownLinks = (text) => {
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        const parts = [];
                        let lastIndex = 0;
                        let match;

                        while ((match = linkRegex.exec(text)) !== null) {
                          // Add text before the link
                          if (match.index > lastIndex) {
                            parts.push(text.substring(lastIndex, match.index));
                          }
                          // Add the link
                          parts.push(
                            <a
                              key={match.index}
                              href={match[2]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 underline transition-colors"
                            >
                              {match[1]}
                            </a>
                          );
                          lastIndex = match.index + match[0].length;
                        }

                        // Add remaining text
                        if (lastIndex < text.length) {
                          parts.push(text.substring(lastIndex));
                        }

                        return parts.length > 0 ? parts : text;
                      };

                      // Check if it's a header (starts with ** and ends with **)
                      if (section.startsWith('**') && section.includes(':**')) {
                        const [header, ...content] = section.split('\n');
                        const cleanHeader = header.replace(/\*\*/g, '').replace(':', '');
                        
                        return (
                          <div key={index} className="border-l-4 border-amber-500 pl-6 py-2">
                            <h3 className="text-xl font-bold text-amber-400 mb-3 uppercase tracking-wide">
                              {cleanHeader}
                            </h3>
                            <div className="space-y-2 text-stone-300">
                              {content.map((line, i) => {
                                if (line.trim().startsWith('-')) {
                                  // Bullet point
                                  const parts = line.replace(/^-\s*/, '').split(':');
                                  return (
                                    <div key={i} className="flex gap-3 items-start">
                                      <span className="text-amber-500 mt-1">•</span>
                                      <div>
                                        {parts.length > 1 ? (
                                          <>
                                            <span className="font-semibold text-amber-200">
                                              {parts[0]}:
                                            </span>
                                            <span className="text-stone-300 ml-2">
                                              {parseMarkdownLinks(parts.slice(1).join(':'))}
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-stone-300">{parseMarkdownLinks(line.replace(/^-\s*/, ''))}</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else if (line.trim()) {
                                  return (
                                    <p key={i} className="text-stone-300 leading-relaxed">
                                      {parseMarkdownLinks(line)}
                                    </p>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        );
                      } else if (section.trim()) {
                        // Regular paragraph
                        return (
                          <p key={index} className="text-stone-300 leading-relaxed">
                            {parseMarkdownLinks(section)}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="p-6 bg-stone-950/50 border-t border-amber-800">
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-800 to-amber-600 hover:from-amber-700 hover:to-amber-500 text-white font-bold uppercase flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Analyze Another Artwork
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
