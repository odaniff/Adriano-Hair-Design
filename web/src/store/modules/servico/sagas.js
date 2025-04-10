import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import types from './types';
import {
  updateServico,
  resetServico,
  allServicos as allServicosAction,
} from './actions';
import api from '../../../services/api';
import { toaster, Message } from 'rsuite';


export function* addServico() {
  const { servico, form, components, behavior } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const formData = new FormData();
    formData.append('servico', JSON.stringify(servico));
    servico.arquivos.forEach((a, i) => {
      formData.append(`arquivo_${i}`, a);
    });

    const { data: res } = yield call(
      api[behavior === 'create' ? 'post' : 'put' ],
      behavior === 'create' ? `/servicos` : `/servicos/${servico._id}`, 
      formData
    );

    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      toaster.push(
        <Message showIcon type="error">Serviço não criado!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allServicosAction());
    yield put(updateServico({ components: { ...components, drawer: false } }));
    yield put(resetServico());
    yield put(allServicos());

    toaster.push(
      <Message showIcon type="success">Serviço criado com sucesso!</Message>,
      { placement: 'topEnd' }
    );

  } catch (err) {
    yield put(updateServico({ form: { ...form, saving: false } }));
    toaster.push(
        <Message showIcon type="success">Serviço criado com sucesso!</Message>,
        { placement: 'topEnd' }
      );
  }
}

export function* allServicos() {
  const { form } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/servicos/`
    );
    yield put(updateServico({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
      // // ALERT DO RSUITE
    }

    yield put(updateServico({ servicos: res.servicosEncontrados }));
  
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* removeArquivo({ key }) {
  const { form } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, `/servicos/delete-arquivo/`, {key});
    
    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Imagem não removida!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    toaster.push(
      <Message showIcon type="success">Imagem removida com sucesso!</Message>,
      { placement: 'topEnd' }
    );

  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, saving: false } }));
    toaster.push(
      <Message showIcon type="error">Imagem não removida!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* saveServico() {
  const { servico, form, components } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const formData = new FormData();
    formData.append('servico', JSON.stringify(servico));
    servico.arquivos.forEach((a, i) => {
      formData.append(`arquivo_${i}`, a);
    });

    const { data: res } = yield call(
      api.put,
      `/servicos/${servico._id}`,
      formData
    );
    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Serviço não atualizado!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allServicosAction());
    yield put(updateServico({ components: { ...components, drawer: false } }));
    yield put(resetServico());

    toaster.push(
      <Message showIcon type="success">Serviço atualizado com sucesso!</Message>,
      { placement: 'topEnd' }
    );
  } catch (err) {
    yield put(updateServico({ form: { ...form, saving: false } }));
    toaster.push(
      <Message showIcon type="error">Serviço não atualizado!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export function* removeServico() {
  const { servico, form, components } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/servicos/${servico._id}`);
    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      toaster.push(
        <Message showIcon type="error">Serviço não removido!</Message>,
        { placement: 'topEnd' }
      );
      return false;
    }

    yield put(allServicosAction());
    yield put(
      updateServico({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );

    toaster.push(
      <Message showIcon type="success">Serviço removido com sucesso!</Message>,
      { placement: 'topEnd' }
    );

  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, saving: false } }));
    toaster.push(
      <Message showIcon type="error">Serviço não removido!</Message>,
      { placement: 'topEnd' }
    );
  }
}

export default all([
  takeLatest(types.ADD_SERVICO, addServico),
  takeLatest(types.ALL_SERVICOS, allServicos),
  takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
  takeLatest(types.SAVE_SERVICO, saveServico),
  takeLatest(types.REMOVE_SERVICO, removeServico),
]);