import { createClient } from "redis";

// Use the internal Redis URL provided by Render
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis", err);
  }
})();

export default redisClient;
