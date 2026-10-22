const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided."
    });
  }

  try {
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Role-Based Authorization Middleware (RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
