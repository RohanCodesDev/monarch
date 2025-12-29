import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, artist, description, imageUrl, style, period, year, medium, analysis, userId, isFavorite, artifactType, civilization } = req.body;

    const artwork = await prisma.artwork.create({
      data: {
        title,
        artist,
        description,
        imageUrl,
        style,
        period,
        year,
        medium,
        analysis,
        userId: userId || 'anonymous',
        isFavorite: isFavorite || false,
        artifactType: artifactType || null,
        civilization: civilization || null,
      },
    });

    return res.status(200).json({ success: true, artwork });
  } catch (error: any) {
    console.error('Error saving artwork:', error);
    return res.status(500).json({ error: 'Failed to save artwork', details: error.message });
  }
}
