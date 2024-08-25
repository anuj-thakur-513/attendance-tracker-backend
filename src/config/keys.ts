export default {
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },
  mongodb: {
    dbUri: process.env.MONGO_URI,
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 24952,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
