const errorHandler = (err, res) => {     
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
}

export default errorHandler;