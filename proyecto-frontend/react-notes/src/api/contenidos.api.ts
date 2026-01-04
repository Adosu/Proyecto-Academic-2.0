const API_URL = "http://localhost:3000";

function getHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/* ======================
   LISTAR CONTENIDOS
   GET /apuntes/temas/:idtema/contenidos
====================== */
export async function listarContenidos(idTema: number) {
  const res = await fetch(
    `${API_URL}/apuntes/temas/${idTema}/contenidos`,
    { headers: getHeaders() }
  );

  if (!res.ok) throw new Error("Error al listar contenidos");
  return res.json();
}

/* ======================
   INSERTAR CONTENIDO
   POST /apuntes/contenidos
====================== */
export async function insertarContenido(data: any) {
  const res = await fetch(`${API_URL}/apuntes/contenidos`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al insertar contenido");
  return res.json();
}

/* ======================
   MODIFICAR CONTENIDO
   PUT /apuntes/contenidos/:idcontenido
====================== */
export async function modificarContenido(data: any) {
  const res = await fetch(
    `${API_URL}/apuntes/contenidos/${data.idContenido}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) throw new Error("Error al modificar contenido");
  return res.json();
}

/* ======================
   ELIMINAR CONTENIDO
   DELETE /apuntes/contenidos/:idcontenido
====================== */
export async function eliminarContenido(idContenido: number) {
  const res = await fetch(
    `${API_URL}/apuntes/contenidos/${idContenido}`,
    {
      method: "DELETE",
      headers: getHeaders()
    }
  );

  if (!res.ok) throw new Error("Error al eliminar contenido");
}
