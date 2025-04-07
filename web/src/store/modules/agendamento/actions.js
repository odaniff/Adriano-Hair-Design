import types from "./types";

export function filterAgendamento(start, end) {
    return {
        type: types.FILTER_AGENDAMENTOS, // Dispara a action '@agendamento/FILTER' com os parâmetros start e end do filterAgendamento
        start,
        end,
    };
}

export function updateAgendamento(agendamentos) {
    return {
        type: types.UPDATE_AGENDAMENTO, // Dispara a action '@agendamento/UPDATE' com o parâmetros agendamento do updateAgendamento
        agendamentos,
    };
}