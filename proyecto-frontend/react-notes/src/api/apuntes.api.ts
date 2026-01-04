import { obtenerIdUsuMat } from "./cursos.api";

const API_URL = "http://localhost:3000";

function getHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export async function listarApuntes(idMateria: number) {
  const idUsuMat = await obtenerIdUsuMat(idMateria);

  const response = await fetch(`${API_URL}/apuntes/${idUsuMat}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al listar apuntes");
  }

  return response.json();
}

export async function insertarApunte(idMateria: number, data: any) {
  const idUsuMat = await obtenerIdUsuMat(idMateria);

  const payload = {
    ...data,
    idusumat: idUsuMat
  };

  const response = await fetch(`${API_URL}/apuntes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Error al insertar apunte");
  }

  return response.json();
}

export async function modificarApunte(apunte: any) {
  const response = await fetch(`${API_URL}/apuntes/${apunte.idApunte}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(apunte)
  });

  if (!response.ok) {
    throw new Error("Error al modificar apunte");
  }

  return response.json();
}

export async function eliminarApunte(idApunte: number) {
  const response = await fetch(`${API_URL}/apuntes/${idApunte}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al eliminar apunte");
  }
}
