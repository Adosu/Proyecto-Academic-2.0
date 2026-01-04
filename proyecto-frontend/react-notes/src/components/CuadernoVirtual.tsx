import { useEffect, useState } from "react";
import { ContenidoApunte } from "./ContenidoApunte";
import "./CuadernoVirtual.css";
import { listarApuntes, insertarApunte, modificarApunte, eliminarApunte } from "../api/apuntes.api";

interface Apunte {
  idApunte: number;
  titulo: string;
  resumen?: string;
}

interface Props {
  idMateria: number;
}

export function CuadernoVirtual({ idMateria }: Props) {
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [apunteSeleccionado, setApunteSeleccionado] = useState<Apunte | undefined>();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [apunteEditando, setApunteEditando] = useState<Apunte | undefined>();

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoResumen, setNuevoResumen] = useState("");

  const [menuVisibleId, setMenuVisibleId] = useState<number | undefined>();

  // 🔹 Cargar apuntes (equivale a ngOnInit)
  useEffect(() => {
    listarApuntes(idMateria)
      .then(data => {
        setApuntes(data);
        if (data.length > 0) {
          setApunteSeleccionado(data[0]);
        }
      })
      .catch(err => console.error(err));
  }, [idMateria]);

  // 🔹 Cerrar menú contextual al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-apunte")) {
        setMenuVisibleId(undefined);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 Helpers
  function resetFormulario() {
    setNuevoTitulo("");
    setNuevoResumen("");
    setModoEdicion(false);
    setApunteEditando(undefined);
  }

  function toggleFormulario() {
    setMostrarFormulario(!mostrarFormulario);
    if (mostrarFormulario) resetFormulario();
  }

  // 🔹 CRUD
  async function crear() {
    if (!nuevoTitulo.trim()) return;

    const apunte = await insertarApunte(idMateria, {
      titulo: nuevoTitulo.trim(),
      resumen: nuevoResumen.trim()
    });

    setApuntes([apunte, ...apuntes]);
    setApunteSeleccionado(apunte);
    toggleFormulario();
  }

  async function guardarCambios() {
    if (!apunteEditando) return;

    const actualizado = {
      ...apunteEditando,
      titulo: nuevoTitulo.trim(),
      resumen: nuevoResumen.trim()
    };

    await modificarApunte(actualizado);

    setApuntes(apuntes.map(a => a.idApunte === actualizado.idApunte ? actualizado : a));
    setApunteSeleccionado(actualizado);
    toggleFormulario();
  }

  async function eliminar(apunte: Apunte) {
    await eliminarApunte(apunte.idApunte);
    const nuevos = apuntes.filter(a => a.idApunte !== apunte.idApunte);
    setApuntes(nuevos);
    setApunteSeleccionado(nuevos[0]);
  }

  return (
    <div className="cuaderno-container">
      <div className="sidebar">
        <h3>Mis Apuntes</h3>

        <button className="nuevo-btn" onClick={toggleFormulario}>
          {mostrarFormulario ? "Cancelar" : modoEdicion ? "Editar apunte" : "+ Nuevo apunte"}
        </button>

        {mostrarFormulario && (
          <div className="formulario-nuevo">
            <input
              placeholder="Título"
              value={nuevoTitulo}
              onChange={e => setNuevoTitulo(e.target.value)}
            />
            <textarea
              placeholder="Resumen (opcional)"
              value={nuevoResumen}
              onChange={e => setNuevoResumen(e.target.value)}
            />
            <button onClick={modoEdicion ? guardarCambios : crear} disabled={!nuevoTitulo.trim()}>
              {modoEdicion ? "Guardar cambios" : "Guardar apunte"}
            </button>
          </div>
        )}

        <div className="lista-apuntes">
          {apuntes.map(apunte => (
            <div
              key={apunte.idApunte}
              className={`item-apunte ${apunteSeleccionado?.idApunte === apunte.idApunte ? "seleccionado" : ""}`}
            >
              <div className="apunte-info" onClick={() => setApunteSeleccionado(apunte)}>
                <h4 title={apunte.titulo}>{apunte.titulo}</h4>
                {apunte.resumen && <p title={apunte.resumen}>{apunte.resumen}</p>}
              </div>

              <div className="menu-apunte">
                <button className="btn-menu" onClick={() => setMenuVisibleId(apunte.idApunte)}>⋯</button>

                {menuVisibleId === apunte.idApunte && (
                  <div className="menu-opciones">
                    <button onClick={() => {
                      setModoEdicion(true);
                      setApunteEditando(apunte);
                      setNuevoTitulo(apunte.titulo);
                      setNuevoResumen(apunte.resumen || "");
                      setMostrarFormulario(true);
                      setMenuVisibleId(undefined);
                    }}>
                      ✏️ Editar apunte
                    </button>
                    <button onClick={() => eliminar(apunte)}>
                      🗑️ Eliminar apunte
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contenido">
        {apunteSeleccionado ? (
          <ContenidoApunte apunte={apunteSeleccionado} />
        ) : (
          <p className="mensaje-seleccion">
            Selecciona un apunte para comenzar.
          </p>
        )}
      </div>
    </div>
  );
}
