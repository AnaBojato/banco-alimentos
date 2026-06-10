import api from "../api/api";

export const obtenerProductos = async () => {
  const response = await api.get("/productos"); 
  return response.data;
};