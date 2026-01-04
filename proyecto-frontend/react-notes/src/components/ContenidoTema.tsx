import { useEffect, useRef, useState } from "react";
import "./ContenidoTema.css";
import {
  listarContenidos,
  insertarContenido,
  modificarContenido,
  eliminarContenido
} from "../api/contenidos.api";

/* =======================
   Interfaces
======================= */
interface Contenido {
  idContenido: number;
  idTema: number;
  texto: string;
}

interface Tema {
  idTema: number;
}

interface Props {
  tema: Tema;
  modoLectura: boolean;
}

/* =======================
   Componente
======================= */
export function ContenidoTema({ tema, modoLectura }: Props) {
  const [contenidos, setContenidos] = useState<Contenido[]>([]);
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoTemporal, setTextoTemporal] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [contenidoPendiente, setContenidoPendiente] =
    useState<Contenido | null>(null);

  const nuevoContenidoRef = useRef<HTMLTextAreaElement | null>(null);
  const editarContenidoRef = useRef<HTMLTextAreaElement | null>(null);

  /* ===== Cargar contenidos ===== */
  useEffect(() => {
    if (!tema?.idTema) return;

    listarContenidos(tema.idTema)
      .then(setContenidos)
      .catch(err => console.error(err));
  }, [tema]);

  /* ===== Foco automático ===== */
  useEffect(() => {
    if (editandoId !== null && editarContenidoRef.current && !inputFocused) {
      editarContenidoRef.current.focus();
      editarContenidoRef.current.setSelectionRange(
        editarContenidoRef.current.value.length,
        editarContenidoRef.current.value.length
      );
      setInputFocused(true);
    }

    if (mostrarNuevo && nuevoContenidoRef.current) {
      nuevoContenidoRef.current.focus();
    }
  }, [editandoId, mostrarNuevo, inputFocused]);

  /* ===== Helpers ===== */
  const ajustarAltura = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  /* ===== Acciones ===== */
  const mostrarInputNuevo = () => {
    if (!modoLectura) {
      setMostrarNuevo(true);
      setNuevoContenido("");
    }
  };

  const agregarContenido = async () => {
    const texto = nuevoContenido.trim();
    if (!texto) {
      cancelarNuevoContenido();
      return;
    }

    const contenido = await insertarContenido({
      idTema: tema.idTema,
      texto
    });

    setContenidos([...contenidos, contenido]);
    cancelarNuevoContenido();
  };

  const cancelarNuevoContenido = () => {
    setNuevoContenido("");
    setMostrarNuevo(false);
  };

  const habilitarEdicion = (c: Contenido) => {
    if (!modoLectura) {
      setEditandoId(c.idContenido);
      setTextoTemporal(c.texto);
      setInputFocused(false);
    }
  };

  const guardarEdicion = async (c: Contenido) => {
    const texto = textoTemporal.trim();
    if (!texto) return;

    await modificarContenido({ ...c, texto });
    setContenidos(
      contenidos.map(cont =>
        cont.idContenido === c.idContenido
          ? { ...cont, texto }
          : cont
      )
    );
    setEditandoId(null);
  };

  const confirmarEliminar = (c: Contenido) => {
    setContenidoPendiente(c);
    setModalVisible(true);
  };

  const eliminarConfirmado = async () => {
    if (!contenidoPendiente) return;

    await eliminarContenido(contenidoPendiente.idContenido);
    setContenidos(
      contenidos.filter(c => c.idContenido !== contenidoPendiente.idContenido)
    );
    setContenidoPendiente(null);
    setModalVisible(false);
  };

  return (
    <div className="contenido-tema-container">
      {/* NUEVO */}
      {!modoLectura && !mostrarNuevo && (
        <div className="nuevo-texto-placeholder" onClick={mostrarInputNuevo}>
          Nuevo contenido...
        </div>
      )}

      {/* INPUT NUEVO */}
      {!modoLectura && mostrarNuevo && (
        <textarea
          ref={nuevoContenidoRef}
          className="input-contenido"
          value={nuevoContenido}
          placeholder="Nuevo contenido..."
          onChange={e => setNuevoContenido(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              agregarContenido();
            } else if (e.key === "Escape") {
              cancelarNuevoContenido();
            }
          }}
          onBlur={agregarContenido}
          onInput={e => ajustarAltura(e.currentTarget)}
          onFocus={e => ajustarAltura(e.currentTarget)}
        />
      )}

      {/* LISTA */}
      <ul className="lista-contenidos">
        {contenidos.map(c => (
          <li key={c.idContenido}>
            {editandoId === c.idContenido ? (
              <textarea
                ref={editarContenidoRef}
                className="input-contenido"
                value={textoTemporal}
                onChange={e => setTextoTemporal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    guardarEdicion(c);
                  } else if (e.key === "Escape") {
                    setEditandoId(null);
                  }
                }}
                onBlur={() => guardarEdicion(c)}
                onInput={e => ajustarAltura(e.currentTarget)}
                onFocus={e => ajustarAltura(e.currentTarget)}
              />
            ) : (
              <>
                <div
                  className="contenido-renderizado"
                  onClick={() => habilitarEdicion(c)}
                >
                  {c.texto}
                </div>
                {!modoLectura && (
                  <button
                    className="btn-eliminar"
                    onClick={() => confirmarEliminar(c)}
                  >
                    🗑️
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {/* MODAL */}
      {modalVisible && (
        <div className="modal-confirmacion">
          <p>¿Deseas eliminar este contenido?</p>
          <button onClick={eliminarConfirmado}>Aceptar</button>
          <button onClick={() => setModalVisible(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
