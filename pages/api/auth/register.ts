import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, fullName, username } = req.body;

    // Validation
    if (!email || !password || !fullName || !username) {
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: "Username must be at least 3 characters" 
      });
    }

    // Check if user already exists (email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already in use" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: fullName,
        password: hashedPassword,
      },
    });

    // Return user info (without password)
    return res.status(201).json({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      message: "User created successfully",
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      error: "Failed to create user",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
