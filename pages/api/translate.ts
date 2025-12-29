import type { NextApiRequest, NextApiResponse } from "next";
import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize Translation API
const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!targetLanguage) {
      return res.status(400).json({ error: "Target language is required" });
    }

    // Skip translation if target is English
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return res.status(200).json({
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage || 'en',
        targetLanguage
      });
    }

    // Translate text
    const [translatedText] = await translate.translate(text, {
      from: sourceLanguage || 'en',
      to: targetLanguage
    });

    return res.status(200).json({
      originalText: text,
      translatedText,
      sourceLanguage: sourceLanguage || 'en',
      targetLanguage
    });

  } catch (error: any) {
    console.error("Translation error:", error);
    return res.status(500).json({ 
      error: "Translation failed",
      details: error.message 
    });
  }
}
