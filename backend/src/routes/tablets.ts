import express, { Request, Response } from "express";
import redisClient from "../config/redisClient"; // Ensure correct import path
import { Tablet } from "../models/doctors";

const router = express.Router();

const PAGE_SIZE = 100; // Number of items per page

router.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const searchQuery = (req.query.search as string) || "";
  const cacheKey = `tablets:page:${page}:search:${searchQuery}`;

  try {
    // Check if data is in Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Build the MongoDB query
    const query = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } } // Case-insensitive search
      : {};

    // Fetch data from MongoDB
    const tablets = await Tablet.find(query)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    // Cache the data in Redis
    await redisClient.set(cacheKey, JSON.stringify(tablets), {
      EX: 86400, // Cache expiration time in seconds (1 hour)
    });

    res.json(tablets);
  } catch (error) {
    console.error("Error fetching tablets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
