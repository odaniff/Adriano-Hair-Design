import types from "./types";

export function filterAgendamento(start, end) {
    return {
        type: types.FILTER_AGENDAMENTOS, // Dispara a action '@agendamento/FILTER' com os parâmetros start e end do filterAgendamento
        start,
        end,
    };
}

export function updateAgendamento(payload) {
    return {
        type: types.UPDATE_AGENDAMENTO, // Dispara a action '@agendamento/UPDATE' com o parâmetros agendamento do updateAgendamento
        payload,
    };
}

export function addAgendamento() {
    return { type: types.ADD_AGENDAMENTO };
}

export function resetAgendamento() {
    return { type: types.RESET_AGENDAMENTO };
}
  
export function removeAgendamento() {
    return { type: types.REMOVE_AGENDAMENTO };
}


export function allServicos() {
    return { type: types.ALL_SERVICOS };
}
export function updateServicos(payload) {
    return {
        type: types.UPDATE_SERVICOS, // Dispara a action '@agendamento/UPDATE' com o parâmetros agendamento do updateAgendamento
        payload,
    };
}

export function allClientes() {
    return { type: types.ALL_CLIENTES };
}
export function updateCLientes(payload) {
    return {
        type: types.UPDATE_CLIENTES, // Dispara a action '@agendamento/UPDATE' com o parâmetros agendamento do updateAgendamento
        payload,
    };
}

export function allHorarios() {
    return { type: types.ALL_HORARIOS };
}
export function updateHorarios(payload) {
    return {
        type: types.UPDATE_HORARIOS, // Dispara a action '@agendamento/UPDATE' com o parâmetros agendamento do updateAgendamento
        payload,
    };
}