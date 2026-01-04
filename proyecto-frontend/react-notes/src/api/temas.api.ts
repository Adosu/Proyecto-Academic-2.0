const API_URL = "http://localhost:3000";

function getHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No autenticado");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/* =======================
   LISTAR TEMAS
   GET /apuntes/:idapunte/temas
======================= */
export async function listarTemas(idApunte: number) {
  const response = await fetch(`${API_URL}/apuntes/${idApunte}/temas`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al listar temas");
  }

  return response.json();
}

/* =======================
   INSERTAR TEMA
   POST /apuntes/temas
======================= */
export async function insertarTema(data: any) {
  const response = await fetch(`${API_URL}/apuntes/temas`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Error al insertar tema");
  }

  return response.json();
}

/* =======================
   MODIFICAR TEMA
   PUT /apuntes/temas/:idtema
======================= */
export async function modificarTema(tema: any) {
  const response = await fetch(
    `${API_URL}/apuntes/temas/${tema.idTema}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(tema)
    }
  );

  if (!response.ok) {
    throw new Error("Error al modificar tema");
  }

  return response.json();
}

/* =======================
   ELIMINAR TEMA
   DELETE /apuntes/temas/:idtema
======================= */
export async function eliminarTema(idTema: number) {
  const response = await fetch(
    `${API_URL}/apuntes/temas/${idTema}`,
    {
      method: "DELETE",
      headers: getHeaders()
    }
  );

  if (!response.ok) {
    throw new Error("Error al eliminar tema");
  }
}
