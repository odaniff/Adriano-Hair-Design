import { produce } from 'immer';
import types from './types';
const INITIAL_STATE = {
  behavior: 'create', // create, update, read
  components: {
    confirmSave: false,
    confirmDelete: false,
    drawer: false,
    view: 'week',
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  horario: {
    dias: [],
    inicio: '',
    fim: '',
    servicos: [],
  },
  horarios: [],
  servicos: [],
};

function horario(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_HORARIO: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }

    case types.RESET_HORARIO: {
      return produce(state, (draft) => {
        draft.horario = INITIAL_STATE.horario;
        return draft;
      });
    }
    default:
      return state;
  }
}

export default horario;