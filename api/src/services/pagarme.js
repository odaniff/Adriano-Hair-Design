// 
import axios from 'axios';  // axios é 

const api = axios.create({
  baseURL: 'https://api.pagar.me/1',
});

import keys from '../docs/keys.json' assert { type: 'json' };
const api_key = keys.api_key;

const pagarmeRequest = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, {
      api_key,
      ...data,
    });

    return { error: false, data: response.data };
  } catch (err) {
    return {
      error: true,
      message: JSON.stringify(err.response.data.errors[0]),
    };
  }
};

export default pagarmeRequest;