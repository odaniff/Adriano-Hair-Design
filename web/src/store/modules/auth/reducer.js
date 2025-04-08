import types from './types';
import { produce } from 'immer';

const INITIAL_STATE = {
  signed: false,
  loading: false,
  error: null,
  user: null,
  isAdmin: false, 
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.SIGN_IN_REQUEST:
      case types.SIGN_UP_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
        
      case types.SIGN_IN_SUCCESS:
        draft.user = action.payload.user;
        draft.signed = true;
        draft.loading = false;
        draft.isAdmin = action.payload.user.isAdmin || false;
        break;
        
      case types.SIGN_UP_SUCCESS:
        draft.loading = false;
        // Aqui você pode decidir se faz login automático ou não
        break;
        
      case types.SIGN_IN_FAILURE:
      case types.SIGN_UP_FAILURE:
        draft.loading = false;
        draft.error = action.payload.error;
        break;
        
      case types.SIGN_OUT:
        return INITIAL_STATE;
        
      case types.UPDATE_AUTH_FIELD:
        draft[action.payload.field] = action.payload.value;
        break;
        
      default:
        return state;
    }
  });
}