const API_URL = `${import.meta.env.VITE_API_URL}/donaciones`; 

export const crearDonacion = async (donacionData) => {
  const response = await fetch(`${API_URL}/public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(donacionData)
  });

  if (!response.ok) {
    throw new Error("Error al registrar la donación");
  }

  return await response.json();
};