exports.success = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message
  });
};

exports.error = (res, message = "Internal Server Error", status = 500, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    error: details
  });
};
