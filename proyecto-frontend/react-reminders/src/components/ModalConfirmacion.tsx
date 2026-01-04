import { useEffect } from "react";
import "./ModalConfirmacion.css";

interface Props {
  visible: boolean;
  titulo?: string;
  mensaje?: string;
  onAceptar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({
  visible,
  titulo = "Confirmación",
  mensaje = "¿Estás seguro que deseas continuar?",
  onAceptar,
  onCancelar
}: Props) {

  /* =======================
     TECLAS (ENTER / ESC)
  ======================= */
  useEffect(() => {
    if (!visible) return;

    const manejarTeclas = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onAceptar();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelar();
      }
    };

    document.addEventListener("keydown", manejarTeclas);
    return () => document.removeEventListener("keydown", manejarTeclas);
  }, [visible, onAceptar, onCancelar]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>{titulo}</h4>
        <p>{mensaje}</p>

        <div className="modal-botones">
          <button className="btn-confirmar" onClick={onAceptar}>
            Aceptar
          </button>
          <button className="btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
