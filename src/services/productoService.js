import api from "../api/api";

export const obtenerProductos = async () => {
  const response = await api.get("/api/productos");
  return response.data;
};