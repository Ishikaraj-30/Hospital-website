const authorize = (roles) => {
  return (req, res, next) => {
    // if role not allowed
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: "Forbidden: Access denied"
      });
    }

    next();
  };
};

module.exports = authorize;