export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Get all available Replicate API tokens
    const apiTokens = [
      process.env.REPLICATE_API_TOKEN_GENERATE,
      process.env.REPLICATE_API_TOKEN_GENERATE_SETBACK1,
      process.env.REPLICATE_API_TOKEN_GENERATE_SETBACK2,
      process.env.REPLICATE_API_TOKEN_GENERATE_SETBACK3,
    ].filter(Boolean); // Remove undefined/empty tokens
    
    if (apiTokens.length === 0) {
      return res.status(500).json({ 
        error: "No Replicate API tokens configured. Please add them to .env.local" 
      });
    }

    console.log(`Found ${apiTokens.length} API tokens available for fallback`);

    // Craft a detailed prompt for authentic historic/ancient art style
    const enhancedPrompt = `Photorealistic authentic ancient/historic art from archaeological context. Subject: ${prompt}. 

STYLE ADAPTATION:
- If cave painting: Prehistoric cave art from 30,000-10,000 BCE, painted on rough limestone cave walls. Natural earth pigments (ochre, iron oxide red, charcoal black, manganese), blown pigment technique, finger painting, rough brushstrokes. Lascaux/Altamira cave style. Faded and weathered from millennia.

- If hieroglyphics/scripts: Authentic ancient Egyptian hieroglyphics OR Mesopotamian cuneiform OR Viking runes OR other historic writing system. Carved or painted on appropriate surface (stone, papyrus, clay tablet). Aged, weathered appearance. Historical accuracy in symbols and layout.

- If ancient artifact: Authentic archaeological artifact made from period-appropriate materials (clay pottery, bronze tools, stone sculptures, ancient coins, ceremonial objects). Museum-quality photography. Visible patina, aging, weathering effects. Excavation dust and earth deposits.

- If ancient pottery/vessels: Greek amphora, Roman pottery, Chinese ceramics, or other culture-specific vessels. Painted decorations in authentic style. Cracks, chips, and restoration marks showing age.

TECHNICAL DETAILS: 
- Natural materials and pigments only (no modern elements)
- Authentic archaeological photography lighting
- Weathered, aged appearance appropriate to time period
- Museum documentation quality
- Visible texture of materials (stone, clay, bronze, pigment on cave walls)
- Historical accuracy in style and execution
- Dark neutral background or archaeological context

FORBIDDEN: Modern elements, digital effects, contemporary art styles, clean/new appearance, fantasy elements. Must look like genuine archaeological find or museum piece.

Ultra-detailed texture showing age, wear, and authentic materials. Documentary/archaeological photography style.`;

    // Try each API token with fallback logic
    let prediction = null;
    let currentToken = null;
    let lastError = null;
    
    for (let i = 0; i < apiTokens.length; i++) {
      try {
        console.log(`Attempting with API token ${i + 1}/${apiTokens.length}...`);
        currentToken = apiTokens[i];
        
        // Call Replicate API
        const response = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: "black-forest-labs/flux-1.1-pro",
            input: {
              prompt: enhancedPrompt,
              aspect_ratio: "16:9",
              output_format: "jpg",
              output_quality: 95,
              safety_tolerance: 5,
              prompt_upsampling: true
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = new Error(`API token ${i + 1} failed: ${errorData.detail || response.statusText}`);
          
          // Check if it's a rate limit or quota error
          const isQuotaError = response.status === 429 || 
                              response.status === 402 || // Payment required
                              errorData.detail?.includes('quota') ||
                              errorData.detail?.includes('rate limit') ||
                              errorData.detail?.includes('billing');
          
          if (isQuotaError && i < apiTokens.length - 1) {
            console.log(`Quota/rate limit hit with token ${i + 1}, trying next token...`);
            continue; // Try next token
          } else if (!isQuotaError) {
            // If it's not a quota error, throw immediately
            throw lastError;
          }
          
          // If this was the last token and it failed, we'll throw after the loop
          continue;
        }

        prediction = await response.json();
        console.log(`Successfully created prediction with API token ${i + 1}`);
        break;
        
      } catch (error) {
        lastError = error;
        console.error(`API token ${i + 1} failed:`, error.message);
        
        if (i < apiTokens.length - 1) {
          console.log(`Trying next API token...`);
          continue;
        }
      }
    }
    
    // If we exhausted all tokens without success
    if (!prediction) {
      throw new Error(`All ${apiTokens.length} API tokens exhausted. Last error: ${lastError?.message}`);
    }
    
    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout
    
    while (!imageUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            "Authorization": `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const status = await statusResponse.json();
      
      if (status.status === "succeeded") {
        imageUrl = status.output;
        break;
      } else if (status.status === "failed") {
        return res.status(500).json({ 
          error: "Image generation failed", 
          details: status.error 
        });
      }
      
      attempts++;
    }

    if (!imageUrl) {
      return res.status(408).json({ 
        error: "Image generation timeout" 
      });
    }

    // Return the generated image URL (stored in DB)
    res.status(200).json({
      imageUrl: imageUrl,
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
