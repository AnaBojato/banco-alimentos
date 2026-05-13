import api from "../api/api";

export const loginService = async (correo, password) => {
  const response = await api.post("/api/auth/login", { correo, password });
  return response.data; // { token, usuario }
};