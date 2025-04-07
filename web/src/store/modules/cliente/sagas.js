import { all, takeLatest, call, put, select} from 'redux-saga/effects';
import api from '../../../services/api';
import { updateCliente, allClientes as allClientesAction, resetCliente} from './actions';
// import consts from '../../../consts';
import types from './types';

export function* allClientes() {
    
    const { form } = yield select(state => state.cliente);
    
    try {
        
        yield put(updateCliente({ form: {...form, filtering:true } }));
        
        const { data: res } = yield call(
            api.get, `/clientes`);

        yield put(updateCliente({ form: { ...form, filtering:false } }));
        
        if(res.error) {
            alert('Erro ao buscar clientes', res.message);
            return false;
        }

        yield put(updateCliente({ clientes: res.clientesEncontrados }));

    } catch (error) {
        yield put(updateCliente({ form: {...form, filtering:false } }));
        alert('Erro ao buscar clientes', error.message);
    }
}

export function* filterCliente() {
    
    const { form, cliente } = yield select(state => state.cliente);
    
    try {
        
        yield put(updateCliente({ form: {...form, filtering:true } }));
        
        const { data: res } = yield call(
            api.post, 
            `/clientes/filter`,
            {
                filters: {
                    email: cliente.email,
                }
            }
        );
        yield put(updateCliente({ form: {...form, filtering:false } }));
        
        if(res.error) {
            alert('Erro ao buscar cliente', res.message);
            return false;
        }

        if(res.clientes.length > 0) {
            yield put(
                updateCliente({ 
                    cliente: res.clientes[0],
                    form: { ...form, filtering:false, disabled:true } 
                })
            );
        
        } else {
            yield put(updateCliente({ form: {...form, disabled:false } }));
        }

    } catch (error) {
        yield put(updateCliente({ form: {...form, filtering:false } }));
        alert('Erro ao buscar clientes', error.message);
    }
}

export function* addCliente() {
    const { form, cliente, components } = yield select(state => state.cliente);
  
    try {
        yield put(updateCliente({ form: { ...form, saving: true } }));

        const formData = new FormData();

        // Adiciona o cliente como string JSON
        formData.append("cliente", JSON.stringify(cliente));
  
        // Se tiver algum arquivo (ex: foto do cliente), adiciona aqui:
        if (cliente.foto) {
            formData.append("foto", cliente.foto); // `foto` é um File vindo do input
        }

        // Faz a requisição para a rota com arquivo
        const { data: res } = yield call(api.post, `/clientes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
  
        yield put(updateCliente({ form: { ...form, saving: false } }));
  
        if (res.error) {
            alert("Erro ao adicionar cliente", res.message);
            return false;
        }
  
        yield put(allClientesAction());
        yield put(updateCliente({ components: { ...components, drawer: false } }));
        yield put(resetCliente());
  
    } catch (error) {
        yield put(updateCliente({ form: { ...form, saving: false } }));
        alert("Erro ao adicionar cliente", error.message);
    }
}
  
export function* unlinkCliente({ payload }) {
    const { form, components, cliente } = yield select((state) => state.cliente);
  
    try {
      yield put(updateCliente({ form: { ...form, saving: true } }));
  
      const { data: res } = yield call(
        api.delete,
        `/clientes/${cliente._id}`
      );
      yield put(updateCliente({ form: { ...form, saving: false } }));

      if (res.error) {
        throw new Error(res.message);
      }
  
    //   if (res.error) {
    //     // ALERT DO RSUITE
    //     notification('error', {
    //       placement: 'topStart',
    //       title: 'Ops...',
    //       description: res.message,
    //     });
    //     return false;
    //   }
  
    //   notification('success', {
    //     placement: 'topStart',
    //     title: 'Tudo certo',
    //     description: 'O cliente foi desvinculado com sucesso!',
    //   });
  
      yield put(allClientesAction());
      yield put(
        updateCliente({
          components: { ...components, drawer: false, confirmDelete: false },
        })
      );
    } catch (err) {
      // COLOCAR AQUI O ALERT DO RSUITE
      yield put(updateCliente({ form: { ...form, saving: false } }));
      console.log(err);
    //   notification('error', {
    //     placement: 'topStart',
    //     title: 'Ops...',
    //     description: err.message,
    //   });
    }
}

export function* linkCliente({ payload }) {
  const { form, components, cliente } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, saving: true } }));

    const { data: res } = yield call(
      api.put,
      `/clientes/ativar/${cliente._id}`
    );
    yield put(updateCliente({ form: { ...form, saving: false } }));

    if (res.error) {
      throw new Error(res.message);
    }

  //   if (res.error) {
  //     // ALERT DO RSUITE
  //     notification('error', {
  //       placement: 'topStart',
  //       title: 'Ops...',
  //       description: res.message,
  //     });
  //     return false;
  //   }

  //   notification('success', {
  //     placement: 'topStart',
  //     title: 'Tudo certo',
  //     description: 'O cliente foi desvinculado com sucesso!',
  //   });

    yield put(allClientesAction());
    yield put(
      updateCliente({
        components: { ...components, drawer: false, confirmActivate: false },
      })
    );
    yield put(resetCliente())

  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateCliente({ form: { ...form, saving: false } }));
    console.log(err);
  //   notification('error', {
  //     placement: 'topStart',
  //     title: 'Ops...',
  //     description: err.message,
  //   });
  }
}

export function* deleteCliente({ payload }) {
    const { form, components, cliente } = yield select((state) => state.cliente);
  
    try {
      yield put(updateCliente({ form: { ...form, saving: true } }));
  
      const { data: res } = yield call(
        api.delete,
        `/clientes/delete/${cliente._id}`
      );
      yield put(updateCliente({ form: { ...form, saving: false } }));

      if (res.error) {
        throw new Error(res.message);
      }
  
    //   if (res.error) {
    //     // ALERT DO RSUITE
    //     notification('error', {
    //       placement: 'topStart',
    //       title: 'Ops...',
    //       description: res.message,
    //     });
    //     return false;
    //   }
  
    //   notification('success', {
    //     placement: 'topStart',
    //     title: 'Tudo certo',
    //     description: 'O cliente foi desvinculado com sucesso!',
    //   });
  
      yield put(allClientesAction());
      yield put(
        updateCliente({
          components: { ...components, drawer: false, confirmDelete: false},
        })
      );
    } catch (err) {
      // COLOCAR AQUI O ALERT DO RSUITE
      yield put(updateCliente({ form: { ...form, saving: false } }));
      console.log(err);
    //   notification('error', {
    //     placement: 'topStart',
    //     title: 'Ops...',
    //     description: err.message,
    //   });
    }
}

export default all([
    takeLatest(types.ALL_CLIENTES, allClientes),
    takeLatest(types.FILTER_CLIENTE, filterCliente),
    takeLatest(types.ADD_CLIENTE, addCliente),
    takeLatest(types.UNLINK_CLIENTE, unlinkCliente),
    takeLatest(types.LINK_CLIENTE, linkCliente),
    takeLatest(types.DELETE_CLIENTE, deleteCliente),   
]);