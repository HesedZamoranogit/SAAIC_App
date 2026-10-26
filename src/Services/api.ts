import axios from "axios";

const API_URL = import.meta.env.VITE_API_LOCAL;

//Configuracion de axios para la comunicacion con el backend de manera 
//centralizada solamente utilizando api.get, api.post, api.put, etc.
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  }
});
