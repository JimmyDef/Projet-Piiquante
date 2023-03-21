const expressRateLimit = require("express-rate-limit");
exports.limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10, // 10 essais
});
