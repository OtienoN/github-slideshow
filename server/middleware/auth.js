const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (for web clients)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id and exclude password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }

      // Update last activity
      user.lastActivity = new Date();
      await user.save({ validateBeforeSave: false });

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      logger.error('JWT verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user;
          // Update last activity
          user.lastActivity = new Date();
          await user.save({ validateBeforeSave: false });
        }
      } catch (error) {
        // Silently fail for optional auth
        logger.warn('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

// Membership tier authorization
const requireMembershipTier = (...tiers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!tiers.includes(req.user.membershipTier)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${tiers.join(' or ')} membership`
      });
    }

    next();
  };
};

// Email verification required
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required to access this feature'
    });
  }

  next();
};

// Admin or owner access (for resources that belong to user)
const adminOrOwner = (userIdField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Admin has access to everything
      if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        return next();
      }

      // Check if user owns the resource
      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      
      if (resourceUserId && resourceUserId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }

      next();
    } catch (error) {
      logger.error('Admin or owner middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

// Rate limiting bypass for admin users
const adminRateLimitBypass = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    req.skipRateLimit = true;
  }
  next();
};

// Activity logging middleware
const logActivity = (action) => {
  return (req, res, next) => {
    // Add activity logging to request
    req.logActivity = {
      action,
      userId: req.user ? req.user._id : null,
      userRole: req.user ? req.user.role : 'anonymous',
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date()
    };

    // Log the activity
    logger.info('User activity:', req.logActivity);

    next();
  };
};

// Subscription/membership validation
const validateSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // For now, all users have basic access
  // This can be extended for premium features
  next();
};

// Two-factor authentication check
const requireTwoFactor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Skip 2FA check for now, but structure is ready
  // if (req.user.twoFactorEnabled && !req.session.twoFactorVerified) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Two-factor authentication required'
  //   });
  // }

  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  requireMembershipTier,
  requireEmailVerification,
  adminOrOwner,
  adminRateLimitBypass,
  logActivity,
  validateSubscription,
  requireTwoFactor
};