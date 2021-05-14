const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

module.exports.validate = async (req, res, next) => {
  const token = req.headers["access-token"];

  if (!token)
    return res.status(403).json({
      success: false,
      message: "request not validated",
      error: {
        statusCode: 403,
        description: "an access token is required to validate your request",
      },
    });

  jwt.verify(token, JWT_SECRET, async (error, success) => {
    if (error) {
      return res.status(403).json({
        success: false,
        message: "invalid token",
        error: {
          statusCode: 403,
          description: "the provided token is invalid",
        },
      });
    }
    req.user = success;
    return next();
  });
};
