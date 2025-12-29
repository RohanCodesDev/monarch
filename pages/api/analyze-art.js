import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

// Disable body parsing (required for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get all available OpenAI API keys
  const apiKeys = [
    process.env.OPENAI_API_KEY,
    process.env.OPENAI_API_KEY_SETBACK1,
    process.env.OPENAI_API_KEY_SETBACK2,
    process.env.OPENAI_API_KEY_SETBACK3,
  ].filter(Boolean); // Remove undefined/empty keys

  if (apiKeys.length === 0) {
    return res.status(500).json({ 
      error: "No OpenAI API keys configured" 
    });
  }

  console.log(`Found ${apiKeys.length} API keys available for fallback`);

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const imageFile = files.image?.[0] || files.image;
    if (!imageFile) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log('Processing image with OpenAI GPT-4 Vision...');

    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = imageFile.mimetype || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Try each API key with fallback logic
    let response = null;
    let lastError = null;
    
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        console.log(`Attempting with API key ${i + 1}/${apiKeys.length}...`);
        
        // Initialize OpenAI with current API key
        const openai = new OpenAI({
          apiKey: apiKeys[i],
        });

        // Call OpenAI GPT-4 Vision
        response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this historic artwork, artifact, or ancient object and provide SPECIFIC, FACTUAL information in the following format:

**IDENTIFICATION & ORIGIN:**
- Object Type: [cave painting/ancient script/pottery/sculpture/artifact/hieroglyphics/etc.]
- Estimated Time Period: [specific era, e.g., "30,000-10,000 BCE" or "3rd Dynasty Egypt"]
- Predicted Geographic Origin: [specific location/region/civilization] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))
- Cultural Context: [specific culture, civilization, or archaeological context] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))
- Historical Significance: [importance in archaeological/historical context]

**TECHNICAL ANALYSIS:**
- Medium/Materials: [specific materials: ochre pigments, limestone, clay, bronze, papyrus, etc.]
- Technique: [painting method, carving technique, firing process, inscription method, etc.]
- Estimated Dimensions: [approximate size if visible]
- Preservation State: [condition, weathering, damage, restoration]
- Dominant Colors/Pigments: [natural pigments used or patina colors]

**STYLE & PERIOD IDENTIFICATION:**
- Art/Artifact Style: [Paleolithic, Neolithic, Ancient Egyptian, Mesopotamian, etc.] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))
- Similar Historical Examples: [comparable artifacts or sites] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))
- Key Stylistic Elements: [specific visual characteristics of the period/culture]
- Archaeological Classification: [type of find, cultural attribution]

**SUBJECT MATTER & ICONOGRAPHY:**
- Main Subject: [what is depicted - animals, humans, deities, symbols, text]
- Secondary Elements: [additional motifs, patterns, decorations]
- Symbolism & Meaning: [religious, ceremonial, practical, or symbolic significance]
- Cultural Function: [ritual object, daily use, burial goods, cave art, writing system, etc.]

**HISTORICAL CONTEXT:**
- Time Period Details: [specific information about the era]
- Civilization/Culture: [detailed context about the people who created it]
- Discovery Context: [if identifiable - where such artifacts are typically found]
- Related Archaeological Sites: [similar finds or important sites] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))

**COMPOSITION & ARTISTIC ELEMENTS:**
- Layout/Organization: [how elements are arranged]
- Technique Quality: [skill level, artistic sophistication]
- Symbolic Patterns: [recurring motifs, geometric designs]
- Writing System (if applicable): [hieroglyphics, cuneiform, runes, etc.] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))

**ARCHAEOLOGICAL & SCIENTIFIC ANALYSIS:**
- Dating Methods: [how such artifacts are typically dated: carbon dating, stratigraphy, etc.]
- Material Analysis: [pigment analysis, material composition]
- Preservation Factors: [why it survived, environmental conditions]
- Similar Museum Collections: [where similar pieces can be found]

**CULTURAL & ANTHROPOLOGICAL SIGNIFICANCE:**
- Social Context: [what it reveals about the society]
- Religious/Spiritual Meaning: [ritual or belief system connections]
- Daily Life Insights: [what it tells us about ancient peoples]
- Trade & Exchange: [evidence of cultural contact or trade routes]

**COMPARATIVE ANALYSIS:**
- Similar Artifacts: [other known examples] ([Wikipedia Link](https://en.wikipedia.org/wiki/...))
- Regional Variations: [how this compares to other finds from the area]
- Chronological Context: [earlier and later developments in the art form]

Provide Wikipedia links in markdown format [Text](URL) for all major topics, civilizations, sites, and artifacts mentioned.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 2000
        });

        // If we successfully got a response, break out of the loop
        console.log(`Successfully analyzed with API key ${i + 1}`);
        break;
        
      } catch (error) {
        lastError = error;
        console.error(`API key ${i + 1} failed:`, error.message);
        
        // Check if it's a rate limit or quota error
        const isQuotaError = error.message?.includes('quota') || 
                            error.message?.includes('rate_limit') ||
                            error.status === 429 ||
                            error.status === 403;
        
        if (isQuotaError && i < apiKeys.length - 1) {
          console.log(`Quota/rate limit hit, trying next API key...`);
          continue; // Try next API key
        } else if (!isQuotaError) {
          // If it's not a quota error, throw immediately
          throw error;
        }
        
        // If this was the last key and it failed, we'll throw after the loop
      }
    }
    
    // If we exhausted all keys without success
    if (!response) {
      throw new Error(`All ${apiKeys.length} API keys exhausted. Last error: ${lastError?.message}`);
    }

    // Cleanup temp file
    fs.unlinkSync(imageFile.filepath);

    const analysis = response.choices[0]?.message?.content || 'Unable to analyze the artwork.';

    console.log('Analysis completed successfully');

    // Check if translation is requested
    const targetLanguage = fields.targetLanguage?.[0] || fields.targetLanguage;
    let translatedAnalysis = analysis;
    
    if (targetLanguage && targetLanguage !== 'en') {
      console.log(`Translating analysis to ${targetLanguage}...`);
      try {
        // Call translation API
        const translateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: analysis,
            targetLanguage,
            sourceLanguage: 'en'
          })
        });
        
        if (translateResponse.ok) {
          const { translatedText } = await translateResponse.json();
          translatedAnalysis = translatedText;
        }
      } catch (translateError) {
        console.error('Translation failed:', translateError);
        // Continue with English version if translation fails
      }
    }

    return res.status(200).json({ 
      analysis: translatedAnalysis,
      originalAnalysis: analysis,
      language: targetLanguage || 'en'
    });
  } catch (error) {
    console.error("OpenAI Vision error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze artwork",
    });
  }
}
