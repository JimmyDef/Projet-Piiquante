const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const [bearer, token] = req.headers.authorization.split(" ");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
