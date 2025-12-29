import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, page = '1' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results: any[] = [];

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
