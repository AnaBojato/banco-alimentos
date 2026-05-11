const API_URL = "http://localhost:3000/donaciones";

export const crearDonacion = async (donacionData) => {

  const response = await fetch(API_URL, {
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