import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, search, style, artist } = req.query;

    const where: any = {};
    
    if (userId) {
      where.userId = userId as string;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { artist: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    if (style) {
      where.style = style as string;
    }
    
    if (artist) {
      where.artist = artist as string;
    }

    const artworks = await prisma.artwork.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to 100 results
    });

    return res.status(200).json({ artworks });
  } catch (error: any) {
    console.error('Error fetching artworks:', error);
    return res.status(500).json({ error: 'Failed to fetch artworks', details: error.message });
  }
}
