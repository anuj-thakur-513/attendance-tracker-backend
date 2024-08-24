import { createClient } from "redis";
import config from "../config/keys";

const redisClient = createClient({
  url: config.redis.url,
  username: config.redis.user,
  password: config.redis.password,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  await redisClient.connect();
}

export { redisClient, connectRedis };
