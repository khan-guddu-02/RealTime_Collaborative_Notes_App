class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong") {
    super(message);
    this.statusCode = statusCode;
    this.status=`${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

export default ApiError ;