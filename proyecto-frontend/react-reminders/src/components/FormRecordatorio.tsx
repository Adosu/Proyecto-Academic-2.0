import { useState } from "react";
import "./FormRecordatorio.css";
import {
  insertarRecordatorio,
  modificarRecordatorio
} from "../api/recordatorios.api";

interface Props {
  modo: "crear" | "editar";
  recordatorio?: any;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function FormRecordatorio({
  modo,
  recordatorio,
  onGuardado,
  onCancelar
}: Props) {
  const [titulo, setTitulo] = useState(recordatorio?.titulo || "");
  const [descripcion, setDescripcion] = useState(recordatorio?.descripcion || "");
  const [fechaLimite, setFechaLimite] = useState(
    recordatorio?.fechaLimite?.split("T")[0] || ""
  );
  const [hora, setHora] = useState(recordatorio?.hora || "");
  const [error, setError] = useState("");

  const guardar = async () => {
    if (!titulo.trim() || titulo.length < 4) {
      setError("El título debe tener al menos 4 caracteres.");
      return;
    }
    if (!fechaLimite || !hora) {
      setError("La fecha y hora son obligatorias.");
      return;
    }

    const data = {
      titulo,
      descripcion,
      fechaLimite,
      hora,
      idRecordatorio: recordatorio?.idRecordatorio
    };

    modo === "crear"
      ? await insertarRecordatorio(data)
      : await modificarRecordatorio(data);

    onGuardado();
  };

  return (
    <div className="recordatorio-container">
      <h2>{modo === "crear" ? "Nuevo Recordatorio" : "Modificar Recordatorio"}</h2>

      <div className="form-group">
        <label>Título</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Fecha límite</label>
        <input type="date" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Hora</label>
        <input type="time" value={hora} onChange={e => setHora(e.target.value)} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="botones">
        <button onClick={guardar}>Guardar</button>
        <button onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
