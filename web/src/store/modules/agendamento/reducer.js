import types from "./types";
import { produce } from "immer";

const INITIAL_STATE = {
    behavior: 'create', // create, update, read
    components: {
        confirmSave: false,
        confirmDelete: false,
        drawer: false,
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false,
    },
    agendamento: {
        email:'',
        // titulo_servico: '', 
        servicoID: '',
        data_inicio: '',
        status: 'A',
    },
    agendamentos: [],
    servicos: [],
    clientes: [],
    horarios: [],
};

function agendamento(state = INITIAL_STATE, action) {
    switch (action.type) {

        case types.UPDATE_AGENDAMENTO: {
            // O Immer vai criar uma cópia do estado e aplicar as alterações
            // o draft é a cópia do estado que pode ser alterada diretamente
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }

        case types.UPDATE_SERVICOS: {
            // O Immer vai criar uma cópia do estado e aplicar as alterações
            // o draft é a cópia do estado que pode ser alterada diretamente
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }

        case types.UPDATE_CLIENTES: {
            // O Immer vai criar uma cópia do estado e aplicar as alterações
            // o draft é a cópia do estado que pode ser alterada diretamente
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }

        case types.UPDATE_HORARIOS: {
            // O Immer vai criar uma cópia do estado e aplicar as alterações
            // o draft é a cópia do estado que pode ser alterada diretamente
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }

        case types.RESET_AGENDAMENTO: {
            return produce(state, (draft) => {
              draft.agendamento = INITIAL_STATE.agendamento;
              return draft;
            });
          }

        default:
            return state;
    }
}

export default agendamento;