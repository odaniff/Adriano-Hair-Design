import { combineReducers } from 'redux';

import agendamento from './modules/agendamento/reducer';
import cliente from './modules/cliente/reducer';
import servico from './modules/servico/reducer';
import auth from './modules/auth/reducer';
import horario from './modules/horario/reducer';

export default combineReducers({
    agendamento,
    cliente,
    servico,
    auth,
    horario,
});