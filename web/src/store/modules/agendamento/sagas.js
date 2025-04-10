import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import api from '../../../services/api';
import { 
  // addAgendamento,
  updateAgendamento, 
  filterAgendamento as filterAgendamentoAction,
  resetAgendamento,
} from './actions';
//import consts from '../../../consts';
import types from './types';

import moment from 'moment';
import 'moment/locale/pt-br';

import { toaster, Message } from 'rsuite';

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
          toaster.push(
            <Message showIcon type="error">Agendamentos não recuperados!</Message>,
            { placement: 'topEnd' }
          );
            return false;
        }

        yield put(updateAgendamento({ agendamentos: res.agendamentos })); // Atualiza o estado com os agendamentos filtrados
        
    } catch (error) {
      toaster.push(
        <Message showIcon type="error">Agendamentos não recuperados!</Message>,
        { placement: 'topEnd' }
      );
    }
}

export function* addAgendamento() {
  try {
    const { agendamento, form, components } = yield select(
      (state) => state.agendamento
    );
    yield put(updateAgendamento({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, '/agendamentos', agendamento)

    yield put(updateAgendamento({ form: { ...form, saving: false } }));

    
    if (res.error) {
      toaster.push(
        <Message showIcon type="error">Agendamento não realizado!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(filterAgendamentoAction(
      moment().startOf('year').format('YYYY-MM-DD'),
      moment().endOf('year').format('YYYY-MM-DD')
    ));
    yield put(updateAgendamento({ components: { ...components, drawer: false, confirmSave: false } }));
    yield put(resetAgendamento());

    toaster.push(
      <Message showIcon type="success">Agendamento realizado com sucesso!</Message>,
      { placement: 'topEnd' }
    );
  } catch (err) {
    toaster.push( 
      <Message showIcon type="error">Agendamento não realizado!</Message>,
      { placement: 'topEnd' }
    );
  }
}


export function* allServicos() {
  const { form } = yield select((state) => state.agendamento);

  try {
    yield put(updateAgendamento({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/servicos/testelabel-ativos`
    );
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));

    if (res.error) {
      toaster.push(
        <Message showIcon type="error">Serviços não recuperados!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(updateAgendamento({ servicos: res.servicos }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));
    toaster.push(
      <Message showIcon type="error">Serviços não recuperados!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* allClientes() {
  const { form } = yield select((state) => state.agendamento);

  try {
    yield put(updateAgendamento({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/clientes`
    );
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));

    if (res.error) {
      toaster.push(
        <Message showIcon type="error">Clientess não recuperados!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(updateAgendamento({ clientes: res.clientesEncontrados }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));
    toaster.push(
      <Message showIcon type="error">Clientes não recuperados!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* allHorarios() {
  const { form } = yield select((state) => state.agendamento);

  try {
    yield put(updateAgendamento({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/horarios`
    );
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));

    if (res.error) {
      toaster.push(
        <Message showIcon type="error">Horarios não recuperados!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(updateAgendamento({ horarios: res.horarios }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateAgendamento({ form: { ...form, filtering: false } }));
    toaster.push(
      <Message showIcon type="error">Horarios não recuperados!</Message>,
      { placement: 'topEnd' }
    );
  }
}
  

export function* removeAgendamento() {
  const { agendamento, form, components } = yield select((state) => state.agendamento);

  try {
    yield put(updateAgendamento({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/agendamentos/${agendamento._id}`);
    yield put(updateAgendamento({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Agendamento não removido!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(filterAgendamentoAction(
      moment().startOf('year').format('YYYY-MM-DD'),
      moment().endOf('year').format('YYYY-MM-DD')
    ));
    yield put(
      updateAgendamento({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );

    toaster.push(
      <Message showIcon type="success">Agendamento removido com sucesso!</Message>,
      { placement: 'topEnd' }
    );

  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateAgendamento({ form: { ...form, saving: false } }));
    toaster.push(
      <Message showIcon type="error">Agendamento não removido!</Message>,
      { placement: 'topEnd' }
    );
  }
}


// Vai escutar a action '@agendamento/FILTER' e executar a função com os parâmetros start e end.
// O takeLatest vai cancelar qualquer requisição anterior e executar somente a última
export default all([
    takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento), 
    takeLatest(types.ADD_AGENDAMENTO, addAgendamento),
    takeLatest(types.REMOVE_AGENDAMENTO, removeAgendamento),

    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.ALL_CLIENTES, allClientes),
    takeLatest(types.ALL_HORARIOS, allHorarios),
]);