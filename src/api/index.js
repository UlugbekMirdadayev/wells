import axios from 'axios';
import { BASE_URL } from 'utils/constants';

export const getWells = (id, method = 'get', body) => {
  const request = axios[method](`${BASE_URL}wells${id ? '/' + id : ''}`, body);
  return request;
};

export const login = (body, config = {}) => {
  const request = axios.post(`${BASE_URL}sign-in`, body, config);
  return request;
};

export const me = (token) => {
  const config = {
    method: 'get',
    url: BASE_URL + 'me',
    headers: {
      Authorization: 'Bearer ' + token
    }
  };

  const request = axios.request(config);
  return request;
};

export const wellUpdate = (id, body, config = {}) => {
  const request = axios.patch(`${BASE_URL}wells/${id}`, body, config);
  return request;
};

export const wellCreate = (body, config = {}) => {
  const request = axios.post(`${BASE_URL}well`, body, config);
  return request;
};

export const wellDelete = (id, config = {}) => {
  const request = axios.delete(`${BASE_URL}wells/${id}`, config);
  return request;
};
