// src/middlewares/errorHandler.js

export default function errorHandler(err, req, res, next) {
  // Log error untuk debugging
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params
  });

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 400,
      error: 'Invalid JSON payload'
    });
  }

  // Default error response
  const status = err.status || 500;
  const response = {
    status,
    error: status === 500 ? 'Internal Server Error' : err.message,
  };

  // Jangan tampilkan stack trace di production
  if (process.env.NODE_ENV !== 'production' && status === 500) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}