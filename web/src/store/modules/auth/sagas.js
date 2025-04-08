import { call, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import types from './types';
import { 
  signInSuccess, 
  signInFailure,
  signUpSuccess,
  signUpFailure
} from './actions';

import { toaster, Message } from 'rsuite';
// import { toast } from 'react-toastify';

function* signIn({ payload }) {
  try {
    const { email, senha, isAdmin } = payload;
    const route = isAdmin ? 'admin/auth/admin' : '/clientes/auth/cliente';
    
    const { data } = yield call(api.post, route, { email, senha });
    
    if (data.error) {
      yield put(signInFailure(data.message));
      // toast.error(data.message);
      return;
    }

    const user = isAdmin ? data.admin : data.cliente;
    
    yield put(signInSuccess( {
      ...user,
      isAdmin,
      signed: true,
    }));
    
  } catch (err) {
    yield put(signInFailure(err.message));
    // toast.error('Erro ao fazer login. Verifique suas credenciais.');
  }
}

function* signUp({ payload }) {
  try {
    const { userData } = payload;

    const formData = new FormData();

    // Converte os dados do usuário em JSON e adiciona no FormData
    formData.append("cliente", JSON.stringify(userData));

    // Se tiver arquivo (ex: userData.foto), adiciona também
    if (userData.arquivo) {
      formData.append("foto", userData.arquivo);
    }

    // Envia como multipart/form-data
    const { data } = yield call(api.post, '/clientes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (data.error) {
      yield put(signUpFailure(data.message));
      return;
    }

    yield put(signUpSuccess(data.cliente));

    // Login automático após cadastro
    yield put({
      type: types.SIGN_IN_REQUEST,
      payload: {
        email: data.cliente.email,
        senha: data.cliente.senha,
        isAdmin: false
      }
    });

    toaster.push(
      <Message showIcon centered type="info" header='Usuário Cadastrado!' closable>
        <p>Faça o Login.</p>
      </Message>,
      { placement: 'topCenter' }
    );

  } catch (err) {
    yield put(signUpFailure(err.message));
  }
}

export default all([
  takeLatest(types.SIGN_IN_REQUEST, signIn),
  takeLatest(types.SIGN_UP_REQUEST, signUp),
]);