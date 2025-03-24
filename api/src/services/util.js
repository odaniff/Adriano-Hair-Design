import moment from 'moment';

const SLOT_DURATION = 30;

// Função para converter horas para minutos
const horasParaminutos = (hourMinute) => {
    //1:30
    const [hora, minutos] = hourMinute.split(':');  
    return parseInt( parseInt(hora) * 60 + parseInt(minutos) );
};

// Função para separar o tempo em 1 slot a cada 30 minutos
const minutosParaSlots = (start, end, duration) => {
    const slices = [];
    let count = 0;

    // 90 min
    start = moment(start);
    // 90 min + 90 min = 180 min
    end = moment(end);  

    while (end > start) {
        slices.push(moment(start).format('HH:mm'));
        start = moment(start).add(duration, 'minutes');
        count ++;
    } 

    return slices;
};

// Função para contatenar data e hora
const mergeDateTime = (date, time) => {
    const merged =`${moment(date).format('YYYY-MM-DD')}T${moment(time).format('HH:mm')}`; 
    return merged;
};

// Função para dividir um array em subarrays a partir de um valor
const splitByValue = (array, value) => {
    let newArray = [[]];  // Inicializa o array de duas dimensões
    array.forEach((item) => {  // Percorre o array
      if (item !== value) {  // Se o item for diferente do valor
        newArray[newArray.length - 1].push(item);  // Adiciona o item no último subarray
      } else {
        newArray.push([]);  // Se o item for igual ao valor, cria um novo subarray
      }
    });
    return newArray;
}

const utilFunctions = {
    horasParaminutos,
    minutosParaSlots,
    mergeDateTime,
    splitByValue,
    SLOT_DURATION,
};

export default utilFunctions;