import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to log all API requests
 * This provides detailed logs for monitoring in Vercel
 */
export const requestLogger = (req, res, next) => {
  // Generate a unique request ID for tracking
  const requestId = uuidv4();
  req.requestId = requestId;
  
  // Capture request start time
  const start = Date.now();
  
  // Build basic log data
  const logData = {
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    userId: req.user?.id || 'unauthenticated',
    // Safely log request body without sensitive data
    body: sanitizeRequestBody(req.body),
    // Add query parameters if present
    query: Object.keys(req.query).length ? req.query : undefined
  };
  
  // Log request received
  console.log(`[${requestId}] REQUEST: ${JSON.stringify(logData)}`);
  
  // Capture and log response information
  const originalEnd = res.end;
  const originalWrite = res.write;
  const chunks = [];
  
  // Capture response body if needed (careful with memory usage)
  if (process.env.LOG_RESPONSE_BODY === 'true') {
    res.write = function(chunk) {
      chunks.push(Buffer.from(chunk));
      return originalWrite.apply(res, arguments);
    };
  }
  
  res.end = function(chunk) {
    // Calculate request duration
    const duration = Date.now() - start;
    
    // Capture final chunk if present
    if (chunk && process.env.LOG_RESPONSE_BODY === 'true') {
      chunks.push(Buffer.from(chunk));
    }
    
    // Get response body if enabled and available
    let responseBody;
    if (process.env.LOG_RESPONSE_BODY === 'true' && chunks.length > 0) {
      const body = Buffer.concat(chunks).toString('utf8');
      try {
        // Try to parse as JSON, fallback to string
        responseBody = JSON.parse(body);
      } catch (e) {
        // If not valid JSON, just use it as a string
        responseBody = body.substring(0, 500); // Limit length
      }
    }
    
    // Build response log data
    const responseLogData = {
      requestId,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      // Include sanitized response body if enabled
      body: responseBody ? sanitizeResponseBody(responseBody) : undefined
    };
    
    // Log response details
    console.log(`[${requestId}] RESPONSE: ${JSON.stringify(responseLogData)}`);
    
    // Continue with original response end
    return originalEnd.apply(res, arguments);
  };
  
  next();
};

/**
 * Sanitize request body to remove sensitive information 
 * before logging
 */
function sanitizeRequestBody(body) {
  if (!body) return undefined;
  
  const sanitized = { ...body };
  
  // List of fields to mask
  const sensitiveFields = [
    'password', 'token', 'secret', 'jwt', 'apiKey', 'api_key', 
    'authorization', 'auth', 'credentials', 'credit_card'
  ];
  
  // Check for sensitive fields and mask them
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Sanitize response body to remove sensitive information
 * before logging
 */
function sanitizeResponseBody(body) {
  if (!body) return undefined;
  
  // If it's a string, truncate it
  if (typeof body === 'string') {
    return body.length > 500 ? `${body.substring(0, 500)}...` : body;
  }
  
  // If it's an object, sanitize sensitive fields
  if (typeof body === 'object') {
    const sanitized = { ...body };
    
    // List of fields to mask
    const sensitiveFields = [
      'password', 'token', 'secret', 'jwt', 'apiKey', 'api_key',
      'authorization', 'auth', 'credentials', 'credit_card'
    ];
    
    // Check for sensitive fields and mask them
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
  
  return body;
}

/**
 * Specialized loggers for different types of events
 */
export const logUserAction = (userId, action, details = {}) => {
  console.log(JSON.stringify({
    type: 'USER_ACTION',
    timestamp: new Date().toISOString(),
    userId,
    action,
    details
  }));
};

export const logAuthEvent = (userId, event, success, details = {}) => {
  console.log(JSON.stringify({
    type: 'AUTH_EVENT',
    timestamp: new Date().toISOString(),
    userId,
    event,
    success,
    details
  }));
};

export const logSystemEvent = (event, details = {}) => {
  console.log(JSON.stringify({
    type: 'SYSTEM_EVENT',
    timestamp: new Date().toISOString(),
    event,
    details
  }));
};

export const logError = (error, context = {}) => {
  console.error(JSON.stringify({
    type: 'ERROR',
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context
  }));
}; 
