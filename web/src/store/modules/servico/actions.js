import types from './types';

export function addServico() {
  return { type: types.ADD_SERVICO };
}

export function updateServico(payload) {
  return { type: types.UPDATE_SERVICO, payload };
}

export function resetServico() {
  return { type: types.RESET_SERVICO };
}

export function allServicos() {
  return { type: types.ALL_SERVICOS };
}

export function removeArquivo(key) {
  return { type: types.REMOVE_ARQUIVO, key };
}

export function saveServico() {
  return { type: types.SAVE_SERVICO };
}

export function removeServico() {
  return { type: types.REMOVE_SERVICO };
}