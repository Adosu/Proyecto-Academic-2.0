import { useEffect, useState } from "react";
import { CuadernoVirtual } from "./components/CuadernoVirtual";

interface Props {
  idMateria: number | null;
}

export function NotesApp({ idMateria }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  // 🔴 Sin token
  if (!token) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial", color: "red" }}>
        ❌ No autenticado
      </div>
    );
  }

  // ✅ Validación CORRECTA
  if (idMateria === null || Number.isNaN(idMateria)) {
    return (
      <div style={{ padding: 20, fontFamily: "Arial", color: "red" }}>
        ❌ No se recibió idMateria
      </div>
    );
  }

  // ✅ Flujo correcto
  return <CuadernoVirtual idMateria={idMateria} />;
}
