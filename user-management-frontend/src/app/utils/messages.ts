export const ERROR_MESSAGES: Record<string, string> = {
  ENTITY_NOT_FOUND: 'User not found.',
  EMAIL_ALREADY_EXISTS: 'Email is already registered.',
  USERNAME_ALREADY_EXISTS: 'Username is already taken.',
  VALIDATION_ERROR: 'Invalid input. Please check for special characters or spaces.',
  CANNOT_DELETE_SELF: 'You cannot delete your own account.',
  UNAUTHORIZED: 'You are not logged in or your session has expired.',
  ILLEGAL_ARGUMENT: 'Invalid request parameters.',
  INTERNAL_ERROR: 'An internal server error occurred.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
};

export const SUCCESS_MESSAGES: Record<string, string> = {
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.'
};
