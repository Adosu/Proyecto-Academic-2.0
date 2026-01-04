import { useEffect, useState } from "react";
import { Actividades } from "./components/Actividades";

export function RemindersApp() {
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

  // ✅ Flujo normal
  return <Actividades />;
}
