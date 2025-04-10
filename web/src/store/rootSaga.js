import { all } from 'redux-saga/effects';

import agendamento from './modules/agendamento/sagas';
import cliente from './modules/cliente/sagas';
import servico from './modules/servico/sagas';
import auth from './modules/auth/sagas';
import horario from './modules/horario/sagas';

export default function* rootSaga(){
    return yield all([
        agendamento,
        cliente,
        servico,
        auth,
        horario,
    ]);
};