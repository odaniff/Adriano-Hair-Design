import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import {
  updateHorario,
  resetHorario,
  allHorarios as allHorariosAction,
} from './actions';
import types from './types';
import api from '../../../services/api';
import { toaster, Message } from 'rsuite';

export function* addHorario() {
  try {
    const { horario, form, components } = yield select(
      (state) => state.horario
    );
    yield put(updateHorario({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, '/horarios', horario)

    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Horário não criado!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allHorariosAction());
    yield put(updateHorario({ components: { ...components, drawer: false, confirmSave: false } }));
    yield put(resetHorario());

    toaster.push(
      <Message showIcon type="success">Horário criado com sucesso!</Message>,
      { placement: 'topEnd' }
    );
  } catch (err) {
    toaster.push(
      <Message showIcon type="error">Horário não criado!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* allHorarios() {
  const { form } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/horarios`
    );
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Horários não recuperados!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(updateHorario({ horarios: res.horarios }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    toaster.push(
      <Message showIcon type="error">Horários não recuperados!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* saveHorario() {
  const { horario, form, components } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, saving: true } }));

    const { data: res } = yield call(
      api.put,
      `/horarios/${horario._id}`,
      horario
    );
    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push( 
        <Message showIcon type="error">Serviço não atualizado!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allHorariosAction());
    yield put(updateHorario({ components: { ...components, drawer: false, confirmSave: false } }));
    yield put(resetHorario());

    toaster.push(
      <Message showIcon type="success">Serviço atualizado com sucesso!</Message>,
      { placement: 'topEnd' }
    );
  } catch (err) {
    yield put(updateHorario({ form: { ...form, saving: false } }));
    toaster.push( 
      <Message showIcon type="error">Serviço não atualizado!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* removeHorario() {
  const { horario, form, components } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/horarios/${horario._id}`);
    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Horário não removido!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allHorariosAction());
    yield put(
      updateHorario({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );

    toaster.push(
      <Message showIcon type="success">Horário removido com sucesso!</Message>,
      { placement: 'topEnd' }
    );

  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, saving: false } }));
    toaster.push(
      <Message showIcon type="error">Horário não removido!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* allServicos() {
  const { form } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/servicos/testelabel`
    );
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Serviços não recuperados!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(updateHorario({ servicos: res.servicos }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    toaster.push(
      <Message showIcon type="error">Serviços não recuperados!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export default all([
  takeLatest(types.ADD_HORARIO, addHorario),
  takeLatest(types.ALL_HORARIOS, allHorarios),
  takeLatest(types.REMOVE_HORARIO, removeHorario),
  takeLatest(types.SAVE_HORARIO, saveHorario),
  takeLatest(types.ALL_SERVICOS, allServicos),
]);