const BASE_URL = "http://localhost:3000/recordatorios";

function getHeaders() {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function getRecordatorios() {
  const res = await fetch(`${BASE_URL}/`, {
    headers: getHeaders()
  });
  return res.json();
}

export async function insertarRecordatorio(data: any) {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function modificarRecordatorio(data: any) {
  const res = await fetch(`${BASE_URL}/${data.idRecordatorio}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function eliminarRecordatorio(id: number) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
}
