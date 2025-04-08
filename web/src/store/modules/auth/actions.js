import types from './types';

export const signInRequest = (email, senha, isAdmin = false) => ({
  type: types.SIGN_IN_REQUEST,
  payload: { email, senha, isAdmin },
});

export const signInSuccess = (user) => ({
  type: types.SIGN_IN_SUCCESS,
  payload: { user },
});

export const signInFailure = (error) => ({
  type: types.SIGN_IN_FAILURE,
  payload: { error },
});

export const signUpRequest = (userData) => ({
  type: types.SIGN_UP_REQUEST,
  payload: { userData },
});

export const signUpSuccess = (user) => ({
  type: types.SIGN_UP_SUCCESS,
  payload: { user },
});

export const signUpFailure = (error) => ({
  type: types.SIGN_UP_FAILURE,
  payload: { error },
});

export const signOut = () => ({
  type: types.SIGN_OUT,
});

export const updateAuthField = (field, value) => ({
  type: types.UPDATE_AUTH_FIELD,
  payload: { field, value },
});