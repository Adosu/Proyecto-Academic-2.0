import { useEffect, useState } from "react";
import "./Actividades.css";
import {
  getRecordatorios,
  eliminarRecordatorio
} from "../api/recordatorios.api";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { FormRecordatorio } from "./FormRecordatorio";

interface Recordatorio {
  idRecordatorio: number;
  fechaLimite: string;
  hora: string;
  titulo: string;
  descripcion: string;
  estado: string;
}

export function Actividades() {
  const [recordatoriosAgrupados, setRecordatoriosAgrupados] = useState<Record<string, Recordatorio[]>>({});
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("7");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const [modoFormulario, setModoFormulario] = useState<"crear" | "editar" | null>(null);
  const [recordatorioEditando, setRecordatorioEditando] = useState<Recordatorio | null>(null);

  const [pendienteEliminar, setPendienteEliminar] = useState<Recordatorio | null>(null);

  /* =======================
     CARGA Y FILTROS
  ======================= */
  useEffect(() => {
    cargarRecordatorios();
  }, [filtroSeleccionado]);

  const cargarRecordatorios = async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let recordatorios: Recordatorio[] = await getRecordatorios();

    // Solo activos
    recordatorios = recordatorios.filter(r => r.estado === "Activo");

    if (filtroSeleccionado === "7" || filtroSeleccionado === "30") {
      const dias = Number(filtroSeleccionado);
      const fechaLimite = new Date(hoy);
      fechaLimite.setDate(hoy.getDate() + dias);

      recordatorios = recordatorios.filter(r => {
        const fecha = new Date(r.fechaLimite);
        return fecha >= hoy && fecha <= fechaLimite;
      });
    }

    if (filtroSeleccionado === "atrasadas") {
      recordatorios = recordatorios.filter(r => {
        const fecha = new Date(r.fechaLimite);
        return fecha < hoy;
      });
    }

    setRecordatoriosAgrupados(agruparPorFecha(recordatorios));
  };

  const agruparPorFecha = (recordatorios: Recordatorio[]) => {
    return recordatorios.reduce((acc, r) => {
      const fecha = r.fechaLimite;
      acc[fecha] = acc[fecha] || [];
      acc[fecha].push(r);
      return acc;
    }, {} as Record<string, Recordatorio[]>);
  };

  const fechasOrdenadas = Object.keys(recordatoriosAgrupados).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  /* =======================
     MENÚ CONTEXTUAL
  ======================= */
  useEffect(() => {
    const cerrarMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-opciones") && !target.closest(".menu-btn")) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener("click", cerrarMenu);
    return () => document.removeEventListener("click", cerrarMenu);
  }, []);

  /* =======================
     FORMULARIO
  ======================= */
  if (modoFormulario) {
    return (
      <FormRecordatorio
        modo={modoFormulario}
        recordatorio={recordatorioEditando}
        onCancelar={() => {
          setModoFormulario(null);
          setRecordatorioEditando(null);
        }}
        onGuardado={() => {
          setModoFormulario(null);
          setRecordatorioEditando(null);
          cargarRecordatorios();
        }}
      />
    );
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="area-personal-container">
      <h2 className="titulo">Área personal</h2>

      <div className="contenido-linea-tiempo">
        <div className="encabezado-linea-tiempo">
          <h3 className="subtitulo">Línea de tiempo</h3>

          <div className="filtros">
            <button
              className="btn-agregar"
              onClick={() => setModoFormulario("crear")}
            >
              + Añadir recordatorio
            </button>

            <select
              value={filtroSeleccionado}
              onChange={e => setFiltroSeleccionado(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="atrasadas">Atrasadas</option>
              <option value="7">Próximos 7 días</option>
              <option value="30">Próximos 30 días</option>
            </select>
          </div>
        </div>

        {fechasOrdenadas.map(fecha => (
          <div key={fecha} className="grupo-fecha">
            <h4 className="fecha">
              {new Date(fecha).toLocaleDateString("es-EC", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </h4>

            {recordatoriosAgrupados[fecha].map(r => (
              <div key={r.idRecordatorio} className="item-recordatorio">
                <div className="hora-icono">
                  <span className="hora">{r.hora}</span>
                </div>

                <div className="detalle-recordatorio">
                  <div className="titulo-recordatorio">{r.titulo}</div>
                  <div className="descripcion">{r.descripcion}</div>
                </div>

                <div className="acciones">
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setMenuAbierto(
                        menuAbierto === r.idRecordatorio
                          ? null
                          : r.idRecordatorio
                      )
                    }
                  >
                    ⋮
                  </button>

                  {menuAbierto === r.idRecordatorio && (
                    <div className="menu-opciones">
                      <button
                        onClick={() => {
                          setRecordatorioEditando(r);
                          setModoFormulario("editar");
                        }}
                      >
                        Modificar
                      </button>
                      <button onClick={() => setPendienteEliminar(r)}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <ModalConfirmacion
        visible={!!pendienteEliminar}
        titulo="Eliminar recordatorio"
        mensaje="¿Deseas eliminar este recordatorio?"
        onAceptar={async () => {
          if (!pendienteEliminar) return;
          await eliminarRecordatorio(pendienteEliminar.idRecordatorio);
          setPendienteEliminar(null);
          cargarRecordatorios();
        }}
        onCancelar={() => setPendienteEliminar(null)}
      />
    </div>
  );
}
