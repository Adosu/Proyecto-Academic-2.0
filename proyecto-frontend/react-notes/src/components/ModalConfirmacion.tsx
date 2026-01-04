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

  // ⌨️ Manejo de teclas (Enter / Escape)
  useEffect(() => {
    if (!visible) return;

    const manejarTeclas = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAceptar();
      } else if (e.key === "Escape") {
        e.preventDefault();
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
