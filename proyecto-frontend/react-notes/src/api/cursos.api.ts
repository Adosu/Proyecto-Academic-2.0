const API_URL = "http://localhost:3000";

function getToken(): string {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function obtenerIdUsuMat(idMateria: number): Promise<number> {
  const response = await fetch(`${API_URL}/cursos/mis-cursos`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener cursos");
  }

  const cursos = await response.json();
  const curso = cursos.find((c: any) => c.idMateria == idMateria);

  if (!curso) {
    throw new Error("No estás inscrito en esta materia");
  }

  return curso.idUsuMat;
}
