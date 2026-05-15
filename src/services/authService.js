import api from "../api/api";

export const loginService = async (correo, password) => {
  const response = await api.post("/api/auth/login", { correo, password });
  return response.data; // { token, usuario }
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};