// enabling CORS for some specific origins only.
const corsOptions = {
  // origin: [`${allowedOrigins}`],
  // origin: "*",
  origin: "http://localhost:3000",
  credentials: true,
};

module.exports = corsOptions;
