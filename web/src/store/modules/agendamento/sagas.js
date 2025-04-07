import { all, takeLatest, call, put } from 'redux-saga/effects';
import api from '../../../services/api';
import { updateAgendamento } from './actions';
//import consts from '../../../consts';
import types from './types';
 

// A function* é uma função geradora que pode ser pausada e retomada
export function* filterAgendamento({start, end}) {
    try {
        const {data: res} = yield call(api.post, `/agendamentos/filter`,
            {
                periodo: {
                    inicio: start,
                    final: end,
                }
            }
        );
        
        if (res.error) {
            alert (res.message);
            return false;
        }

        yield put(updateAgendamento(res.agendamentosFiltrados)); // Atualiza o estado com os agendamentos filtrados
        
    } catch (error) {
        alert(error.message);
    }
}

// Vai escutar a action '@agendamento/FILTER' e executar a função com os parâmetros start e end.
// O takeLatest vai cancelar qualquer requisição anterior e executar somente a última
export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);