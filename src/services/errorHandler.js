export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You are not authorized to perform this action';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An error occurred';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'Network error. Please check your connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'An unexpected error occurred';
  }
};