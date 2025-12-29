import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // In a real app, you would clear session/JWT here
  // For now, just return success (client will clear localStorage)
  return res.status(200).json({ message: "Logout successful" });
}
