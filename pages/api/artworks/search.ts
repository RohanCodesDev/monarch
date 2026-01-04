import type { NextApiRequest, NextApiResponse } from 'next';

// Helper to get Wikipedia language code
function getWikipediaLangCode(lang: string): string {
  const langMap: Record<string, string> = {
    en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', pt: 'pt',
    ar: 'ar', zh: 'zh', ja: 'ja', hi: 'hi', el: 'el', he: 'he',
    ru: 'ru', ko: 'ko', tr: 'tr', nl: 'nl', pl: 'pl', sv: 'sv',
    da: 'da', fi: 'fi', no: 'no', cs: 'cs', ro: 'ro', hu: 'hu',
    th: 'th', vi: 'vi', id: 'id', uk: 'uk', bn: 'bn', fa: 'fa',
    ta: 'ta', te: 'te', mr: 'mr', gu: 'gu', kn: 'kn', ml: 'ml',
    ur: 'ur', sw: 'sw', az: 'az', eu: 'eu', be: 'be', bg: 'bg',
    ca: 'ca', hr: 'hr', et: 'et', gl: 'gl', ka: 'ka', is: 'is',
    ga: 'ga', lv: 'lv', lt: 'lt', mk: 'mk', sr: 'sr', sk: 'sk', sl: 'sl'
  };
  return langMap[lang] || 'en';
}

// Helper to fetch Wikipedia data in specific language
async function fetchWikipediaArticles(query: string, limit: number = 10, lang: string = 'en') {
  try {
    const wikiLang = getWikipediaLangCode(lang);
    const response = await fetch(
      `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' ancient artifact art history')}&format=json&srlimit=${limit}&srprop=snippet|titlesnippet&origin=*`
    );
    const data = await response.json();
    
    if (data.query?.search) {
      return data.query.search.map((item: any) => ({
        title: item.title,
        snippet: item.snippet.replace(/<[^>]*>/g, ''),
        pageId: item.pageid,
        url: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`
      }));
    }
    return [];
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return [];
  }
}

// Helper to get Wikipedia article extract and image in specific language
async function getWikipediaDetails(title: string, lang: string = 'en') {
  try {
    const wikiLang = getWikipediaLangCode(lang);
    const response = await fetch(
      `https://${wikiLang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages|info&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=500&inprop=url&format=json&origin=*`
    );
    const data = await response.json();
    const pages = data.query?.pages;
    
    if (pages) {
      const page = Object.values(pages)[0] as any;
      return {
        extract: page.extract || '',
        imageUrl: page.thumbnail?.source || null,
        url: page.fullurl || `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
      };
    }
    return null;
  } catch (error) {
    console.error('Wikipedia details error:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, page = '1', lang = 'en' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results: any[] = [];
    const userLang = lang as string;
    
    // First, get Wikipedia articles in user's language
    const wikiArticles = await fetchWikipediaArticles(query as string, 10, userLang);
    
    for (const article of wikiArticles) {
      const details = await getWikipediaDetails(article.title, userLang);
      
      if (details) {
        results.push({
          id: `wiki_${article.pageId}`,
          title: article.title,
          artist: 'Wikipedia',
          date: 'Historical',
          origin: 'Various',
          medium: 'Encyclopedia Article',
          category: 'Historic Information',
          imageUrl: details.imageUrl,
          thumbnailUrl: details.imageUrl,
          description: article.snippet,
          extract: details.extract.substring(0, 300) + '...',
          links: {
            details: details.url,
            artistWiki: null,
            categoryWiki: details.url,
          },
          source: 'Wikipedia'
        });
      }
    }

    // 1. Art Institute of Chicago API (Free, no key needed)
    try {
      const chicagoResponse = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query as string)}&limit=10&page=${page}&fields=id,title,artist_display,date_display,place_of_origin,medium_display,classification_title,image_id,thumbnail`
      );
      const chicagoData = await chicagoResponse.json();
      
      if (chicagoData.data) {
        chicagoData.data.forEach((item: any) => {
          results.push({
            id: `chicago_${item.id}`,
            title: item.title || 'Untitled',
            artist: item.artist_display || 'Unknown Artist',
            date: item.date_display || 'Unknown Date',
            origin: item.place_of_origin || 'Unknown',
            medium: item.medium_display || 'Unknown Medium',
            category: item.classification_title || 'Artwork',
            imageUrl: item.image_id 
              ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
              : null,
            thumbnailUrl: item.thumbnail?.lqip || null,
            links: {
              details: `https://www.artic.edu/artworks/${item.id}`,
              artistWiki: item.artist_display ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.artist_display.split('(')[0].trim())}` : null,
              categoryWiki: item.classification_title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.classification_title)}` : null,
            },
            source: 'Art Institute of Chicago'
          });
        });
      }
    } catch (error) {
      console.error('Chicago API error:', error);
    }

    // 2. Metropolitan Museum of Art API (Free, no key needed)
    try {
      const metSearchResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query as string)}&hasImages=true`
      );
      const metSearchData = await metSearchResponse.json();
      
      if (metSearchData.objectIDs && metSearchData.objectIDs.length > 0) {
        // Get first 10 objects
        const objectIds = metSearchData.objectIDs.slice(0, 10);
        
        const metObjects = await Promise.all(
          objectIds.map(async (id: number) => {
            try {
              const response = await fetch(
                `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
              );
              return await response.json();
            } catch {
              return null;
            }
          })
        );

        metObjects.forEach((item: any) => {
          if (item && item.primaryImage) {
            results.push({
              id: `met_${item.objectID}`,
              title: item.title || 'Untitled',
              artist: item.artistDisplayName || 'Unknown Artist',
              date: item.objectDate || 'Unknown Date',
              origin: item.culture || item.country || 'Unknown',
              medium: item.medium || 'Unknown Medium',
              category: item.classification || item.objectName || 'Artwork',
              imageUrl: item.primaryImage,
              thumbnailUrl: item.primaryImageSmall || item.primaryImage,
              links: {
                details: item.objectURL,
                artistWiki: item.artistWikidata_URL || (item.artistDisplayName ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.artistDisplayName)}` : null),
                categoryWiki: item.classification ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.classification)}` : null,
              },
              source: 'The Metropolitan Museum of Art'
            });
          }
        });
      }
    } catch (error) {
      console.error('Met API error:', error);
    }

    // 3. Rijksmuseum API (Free but needs key - get at https://data.rijksmuseum.nl/object-metadata/api/)
    if (process.env.RIJKSMUSEUM_API_KEY) {
      try {
        const rijksResponse = await fetch(
          `https://www.rijksmuseum.nl/api/en/collection?key=${process.env.RIJKSMUSEUM_API_KEY}&q=${encodeURIComponent(query as string)}&imgonly=true&ps=10&p=${page}`
        );
        const rijksData = await rijksResponse.json();
        
        if (rijksData.artObjects) {
          rijksData.artObjects.forEach((item: any) => {
            results.push({
              id: `rijks_${item.objectNumber}`,
              title: item.title || item.longTitle || 'Untitled',
              artist: item.principalOrFirstMaker || 'Unknown Artist',
              date: item.dating?.presentingDate || 'Unknown Date',
              origin: 'Netherlands',
              medium: item.physicalMedium || 'Unknown Medium',
              category: item.objectTypes?.[0] || 'Artwork',
              imageUrl: item.webImage?.url || null,
              thumbnailUrl: item.headerImage?.url || item.webImage?.url,
              links: {
                details: item.links?.web || `https://www.rijksmuseum.nl/en/collection/${item.objectNumber}`,
                artistWiki: item.principalOrFirstMaker ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.principalOrFirstMaker)}` : null,
                categoryWiki: item.objectTypes?.[0] ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.objectTypes[0])}` : null,
              },
              source: 'Rijksmuseum'
            });
          });
        }
      } catch (error) {
        console.error('Rijksmuseum API error:', error);
      }
    }

    // Remove duplicates and limit results
    const uniqueResults = results.slice(0, 30);

    return res.status(200).json({ 
      artworks: uniqueResults,
      total: uniqueResults.length,
      query: query as string
    });

  } catch (error: any) {
    console.error('Error searching artworks:', error);
    return res.status(500).json({ 
      error: 'Failed to search artworks', 
      details: error.message 
    });
  }
}
