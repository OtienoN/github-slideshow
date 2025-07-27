const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.logError(err, req);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from duplicate key error
    const field = Object.keys(err.keyValue)[0];
    if (field === 'email') {
      message = 'Email address is already registered';
    } else if (field === 'phone') {
      message = 'Phone number is already registered';
    } else if (field === 'orderNumber') {
      message = 'Order number already exists';
    }
    
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    error = {
      message: messages.join(', '),
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      message,
      statusCode: 401
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = {
      message,
      statusCode: 400
    };
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    let message = 'Payment processing error';
    
    switch (err.type) {
      case 'StripeCardError':
        message = err.message || 'Your card was declined';
        break;
      case 'StripeRateLimitError':
        message = 'Too many requests to payment processor';
        break;
      case 'StripeInvalidRequestError':
        message = 'Invalid payment request';
        break;
      case 'StripeAPIError':
        message = 'Payment service temporarily unavailable';
        break;
      case 'StripeConnectionError':
        message = 'Network error with payment processor';
        break;
      case 'StripeAuthenticationError':
        message = 'Payment authentication failed';
        break;
    }
    
    error = {
      message,
      statusCode: 400
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = {
      message,
      statusCode: 429
    };
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    const message = 'CORS policy violation';
    error = {
      message,
      statusCode: 403
    };
  }

  // Default error response structure
  const errorResponse = {
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  // Add request ID for tracking (if available)
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  // Add validation errors details for client
  if (err.name === 'ValidationError' && err.errors) {
    errorResponse.validationErrors = {};
    Object.keys(err.errors).forEach(field => {
      errorResponse.validationErrors[field] = err.errors[field].message;
    });
  }

  // Security-related error logging
  const securityEvents = [
    'JsonWebTokenError',
    'TokenExpiredError',
    'Unauthorized',
    'Forbidden'
  ];

  if (securityEvents.includes(err.name) || error.statusCode === 401 || error.statusCode === 403) {
    logger.logSecurity('Security Error', {
      error: err.name,
      message: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      userId: req.user ? req.user._id : null
    });
  }

  // Determine status code
  const statusCode = error.statusCode || 500;

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found middleware
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  notFound
};