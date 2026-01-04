import React, { useEffect, useRef, useState } from "react";
import { ContenidoTema } from "./ContenidoTema";
import { ModalConfirmacion } from "./ModalConfirmacion";
import "./ContenidoApunte.css";
import {
  listarTemas,
  insertarTema,
  modificarTema,
  eliminarTema
} from "../api/temas.api";

/* =======================
   Interfaces
======================= */
interface Tema {
  idTema: number;
  idApunte: number;
  idTemaPadre: number | null;
  nombre: string;
}

interface Apunte {
  idApunte: number;
}

interface Props {
  apunte: Apunte;
}

/* =======================
   Componente principal
======================= */
export function ContenidoApunte({ apunte }: Props) {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [nuevoTema, setNuevoTema] = useState("");
  const [modoLectura, setModoLectura] = useState(true);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombreTemporal, setNombreTemporal] = useState("");

  const [nuevoSubtemaPadreId, setNuevoSubtemaPadreId] =
    useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [temaPendiente, setTemaPendiente] = useState<Tema | null>(null);

  const inputEditarRef = useRef<HTMLInputElement | null>(null);
  const inputNuevoSubtemaRef = useRef<HTMLInputElement | null>(null);

  /* ===== Cargar temas ===== */
  useEffect(() => {
    if (!apunte?.idApunte) return;

    listarTemas(apunte.idApunte)
      .then(setTemas)
      .catch(err => console.error("Error al cargar temas:", err));
  }, [apunte]);

  /* ===== Foco automático ===== */
  useEffect(() => {
    if (editandoId !== null && inputEditarRef.current) {
      inputEditarRef.current.focus();
      inputEditarRef.current.setSelectionRange(
        inputEditarRef.current.value.length,
        inputEditarRef.current.value.length
      );
    }
  }, [editandoId]);

  useEffect(() => {
    if (nuevoSubtemaPadreId !== null && inputNuevoSubtemaRef.current) {
      inputNuevoSubtemaRef.current.focus();
    }
  }, [nuevoSubtemaPadreId]);

  /* ===== Helpers ===== */
  const temasPadre = temas.filter(t => t.idTemaPadre === null);
  const obtenerSubtemas = (padre: Tema) =>
    temas.filter(t => Number(t.idTemaPadre) === padre.idTema);

  const alternarModo = () => setModoLectura(!modoLectura);

  /* ===== CRUD ===== */
  const agregarTema = async () => {
    if (!nuevoTema.trim()) return;

    const tema = await insertarTema({
      nombre: nuevoTema.trim(),
      idApunte: apunte.idApunte,
      idTemaPadre: null
    });

    setTemas([...temas, tema]);
    setNuevoTema("");
  };

  const agregarSubtema = (padre: Tema) => {
    setNuevoSubtemaPadreId(padre.idTema);
    setEditandoId(-1);
    setNombreTemporal("");
  };

  const guardarNuevoSubtema = async (padre: Tema) => {
    if (!nombreTemporal.trim()) {
      cancelarNuevoSubtema();
      return;
    }

    const tema = await insertarTema({
      nombre: nombreTemporal.trim(),
      idApunte: apunte.idApunte,
      idTemaPadre: padre.idTema
    });

    setTemas([...temas, tema]);
    cancelarNuevoSubtema();
  };

  const cancelarNuevoSubtema = () => {
    setNuevoSubtemaPadreId(null);
    setEditandoId(null);
    setNombreTemporal("");
  };

  const habilitarEdicion = (tema: Tema) => {
    if (modoLectura) return;
    setEditandoId(tema.idTema);
    setNombreTemporal(tema.nombre);
  };

  const guardarEdicion = async (tema: Tema) => {
    if (!nombreTemporal.trim()) return;

    await modificarTema({ ...tema, nombre: nombreTemporal.trim() });
    setTemas(
      temas.map(t =>
        t.idTema === tema.idTema
          ? { ...t, nombre: nombreTemporal.trim() }
          : t
      )
    );
    setEditandoId(null);
  };

  /* ===== ELIMINACIÓN CON MODAL ===== */
  const confirmarEliminar = (tema: Tema) => {
    setTemaPendiente(tema);
    setModalVisible(true);
  };

  const eliminarConfirmado = async () => {
    if (!temaPendiente) return;

    await eliminarTema(temaPendiente.idTema);
    setTemas(
      temas.filter(
        t =>
          t.idTema !== temaPendiente.idTema &&
          t.idTemaPadre !== temaPendiente.idTema
      )
    );
    setTemaPendiente(null);
    setModalVisible(false);
  };

  /* ===== Render ===== */
  return (
    <div className="contenido-apunte-container">
      {/* BOTÓN MODO */}
      <div className="modo-toggle-container">
        <button
          className={`modo-toggle-btn ${
            modoLectura ? "modo-lectura" : "modo-edicion"
          }`}
          onClick={alternarModo}
        >
          {modoLectura ? "Modo Lectura" : "Modo Edición"}
        </button>
      </div>

      {/* NUEVO TEMA PADRE */}
      {!modoLectura && (
        <div className="formulario-tema">
          <input
            className="input-tema"
            placeholder="Nuevo tema padre (Enter para añadir)"
            value={nuevoTema}
            onChange={e => setNuevoTema(e.target.value)}
            onKeyDown={e => e.key === "Enter" && agregarTema()}
          />
        </div>
      )}

      {/* TEMAS */}
      {temasPadre.map(tema => (
        <TemaItem
          key={tema.idTema}
          tema={tema}
          nivel={0}
          obtenerSubtemas={obtenerSubtemas}
          modoLectura={modoLectura}
          editandoId={editandoId}
          nombreTemporal={nombreTemporal}
          setNombreTemporal={setNombreTemporal}
          habilitarEdicion={habilitarEdicion}
          guardarEdicion={guardarEdicion}
          agregarSubtema={agregarSubtema}
          confirmarEliminar={confirmarEliminar}
          nuevoSubtemaPadreId={nuevoSubtemaPadreId}
          guardarNuevoSubtema={guardarNuevoSubtema}
          cancelarNuevoSubtema={cancelarNuevoSubtema}
          inputEditarRef={inputEditarRef}
          inputNuevoSubtemaRef={inputNuevoSubtemaRef}
        />
      ))}

      {/* MODAL CONFIRMACIÓN */}
      <ModalConfirmacion
        visible={modalVisible}
        titulo="Eliminar tema"
        mensaje="¿Eliminar este tema y todos sus subtemas?"
        onAceptar={eliminarConfirmado}
        onCancelar={() => setModalVisible(false)}
      />
    </div>
  );
}

/* =======================
   Componente recursivo
======================= */
interface TemaItemProps {
  tema: Tema;
  nivel: number;
  obtenerSubtemas: (t: Tema) => Tema[];
  modoLectura: boolean;
  editandoId: number | null;
  nombreTemporal: string;
  setNombreTemporal: (v: string) => void;
  habilitarEdicion: (t: Tema) => void;
  guardarEdicion: (t: Tema) => void;
  agregarSubtema: (t: Tema) => void;
  confirmarEliminar: (t: Tema) => void;
  nuevoSubtemaPadreId: number | null;
  guardarNuevoSubtema: (t: Tema) => void;
  cancelarNuevoSubtema: () => void;
  inputEditarRef: React.RefObject<HTMLInputElement | null>;
  inputNuevoSubtemaRef: React.RefObject<HTMLInputElement | null>;
}

function TemaItem({
  tema,
  nivel,
  obtenerSubtemas,
  modoLectura,
  editandoId,
  nombreTemporal,
  setNombreTemporal,
  habilitarEdicion,
  guardarEdicion,
  agregarSubtema,
  confirmarEliminar,
  nuevoSubtemaPadreId,
  guardarNuevoSubtema,
  cancelarNuevoSubtema,
  inputEditarRef,
  inputNuevoSubtemaRef
}: TemaItemProps) {
  return (
    <div className="bloque-tema" style={{ marginLeft: nivel * 20 }}>
      {editandoId === tema.idTema ? (
        <input
          ref={inputEditarRef}
          className="input-tema"
          value={nombreTemporal}
          onChange={e => setNombreTemporal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && guardarEdicion(tema)}
          onBlur={() => guardarEdicion(tema)}
        />
      ) : (
        <div className="titulo-tema">
          <span onClick={() => habilitarEdicion(tema)}>
            {tema.nombre}
          </span>
          {!modoLectura && (
            <span>
              <button onClick={() => agregarSubtema(tema)}>➕</button>
              <button onClick={() => confirmarEliminar(tema)}>🗑️</button>
            </span>
          )}
        </div>
      )}

      {/* CONTENIDO */}
      <ContenidoTema tema={tema} modoLectura={modoLectura} />

      {/* SUBTEMA NUEVO */}
      {!modoLectura && nuevoSubtemaPadreId === tema.idTema && (
        <div className="subtema">
          <input
            ref={inputNuevoSubtemaRef}
            className="input-tema"
            value={nombreTemporal}
            onChange={e => setNombreTemporal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && guardarNuevoSubtema(tema)}
            onBlur={cancelarNuevoSubtema}
            placeholder="Nuevo subtema..."
          />
        </div>
      )}

      {/* SUBTEMAS */}
      {obtenerSubtemas(tema).map(sub => (
        <TemaItem
          key={sub.idTema}
          tema={sub}
          nivel={nivel + 1}
          obtenerSubtemas={obtenerSubtemas}
          modoLectura={modoLectura}
          editandoId={editandoId}
          nombreTemporal={nombreTemporal}
          setNombreTemporal={setNombreTemporal}
          habilitarEdicion={habilitarEdicion}
          guardarEdicion={guardarEdicion}
          agregarSubtema={agregarSubtema}
          confirmarEliminar={confirmarEliminar}
          nuevoSubtemaPadreId={nuevoSubtemaPadreId}
          guardarNuevoSubtema={guardarNuevoSubtema}
          cancelarNuevoSubtema={cancelarNuevoSubtema}
          inputEditarRef={inputEditarRef}
          inputNuevoSubtemaRef={inputNuevoSubtemaRef}
        />
      ))}
    </div>
  );
}
