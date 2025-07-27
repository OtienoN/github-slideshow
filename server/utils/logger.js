const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about these colors
winston.addColors(colors);

// Define the custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add request logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Custom logging methods for specific use cases
logger.logRequest = (req, res) => {
  const { method, url, ip, body } = req;
  const userId = req.user ? req.user._id : 'anonymous';
  
  logger.http(`${method} ${url} - IP: ${ip} - User: ${userId}`, {
    method,
    url,
    ip,
    userId,
    userAgent: req.get('User-Agent'),
    body: method === 'POST' ? body : undefined
  });
};

logger.logError = (error, req = null) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  
  if (req) {
    errorInfo.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : null
    };
  }
  
  logger.error('Application Error:', errorInfo);
};

logger.logSecurity = (event, details = {}) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.logOrderActivity = (orderId, action, userId, details = {}) => {
  logger.info(`Order Activity: ${action}`, {
    orderId,
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.logPayment = (orderId, action, amount, method, details = {}) => {
  logger.info(`Payment Activity: ${action}`, {
    orderId,
    action,
    amount,
    method,
    timestamp: new Date().toISOString(),
    ...details
  });
};

module.exports = logger;