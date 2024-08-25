import Redis from "ioredis";
import config from "../config/keys";

const redis = new Redis({
  host: config.redis.host,
  username: config.redis.user,
  password: config.redis.password,
  port: config.redis.port as number,
});

export { redis };
