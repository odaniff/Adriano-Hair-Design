const types = {
  // Login
  SIGN_IN_REQUEST: '@auth/SIGN_IN_REQUEST',
  SIGN_IN_SUCCESS: '@auth/SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: '@auth/SIGN_IN_FAILURE',
  
  // Cadastro
  SIGN_UP_REQUEST: '@auth/SIGN_UP_REQUEST',
  SIGN_UP_SUCCESS: '@auth/SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE: '@auth/SIGN_UP_FAILURE',
  
  // Logout
  SIGN_OUT: '@auth/SIGN_OUT',
  
  // Atualização de estado
  UPDATE_AUTH_FIELD: '@auth/UPDATE_FIELD',
};

export default types;