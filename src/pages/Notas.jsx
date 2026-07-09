import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_NOTAS, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  idAsignatura: "",
  idEvaluacion: "",
  calificacionObtenida: "",
  observacionDocente: "",
};

export default function Notas() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_NOTAS);

  const [notas, setNotas] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");

  async function cargarNotas() {
    try {
      const response = await academicoApi.get("/notas");
      setNotas(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de notas.");
    }
  }

  async function cargarEvaluaciones() {
    try {
      const response = await academicoApi.get("/evaluaciones");
      setEvaluaciones(response.data);
    } catch (err) {
      // El select queda vacío si esto falla
    }
  }

  useEffect(() => {
    cargarNotas();
    cargarEvaluaciones();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(nota) {
    setEditandoId(nota.idNota);
    setFormulario({
      idEstudiante: nota.idEstudiante,
      idAsignatura: nota.idAsignatura,
      idEvaluacion: nota.evaluacion?.idEvaluacion ?? "",
      calificacionObtenida: nota.calificacionObtenida,
      observacionDocente: nota.observacionDocente ?? "",
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (editandoId) {
        // El backend solo acepta actualizar la calificación (revisa ActualizarNotaRequest)
        await academicoApi.put(`/notas/${editandoId}`, {
          calificacionObtenida: Number(formulario.calificacionObtenida),
        });
      } else {
        const datos = {
          idEstudiante: Number(formulario.idEstudiante),
          idAsignatura: Number(formulario.idAsignatura),
          idEvaluacion: Number(formulario.idEvaluacion),
          calificacionObtenida: Number(formulario.calificacionObtenida),
          observacionDocente: formulario.observacionDocente,
        };
        await academicoApi.post("/notas", datos);
      }
      cancelarEdicion();
      if (busquedaEstudiante) {
        buscarPorEstudiante();
      } else {
        cargarNotas();
      }
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar la nota.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta nota?")) return;
    try {
      await academicoApi.delete(`/notas/${id}`);
      if (busquedaEstudiante) {
        buscarPorEstudiante();
      } else {
        cargarNotas();
      }
    } catch (err) {
      setError("No se pudo eliminar la nota.");
    }
  }

  async function buscarPorEstudiante() {
    if (!busquedaEstudiante.trim()) {
      cargarNotas();
      return;
    }
    try {
      const response = await academicoApi.get(`/notas/estudiante/${busquedaEstudiante.trim()}`);
      setNotas(response.data);
    } catch (err) {
      setError("No se pudo buscar las notas de ese estudiante.");
    }
  }

  return (
    <div className="pagina">
      <h2>Notas</h2>

      <input
        className="buscador"
        placeholder="Buscar por ID de estudiante y presionar Enter..."
        value={busquedaEstudiante}
        onChange={(e) => setBusquedaEstudiante(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && buscarPorEstudiante()}
      />

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="idEstudiante"
            type="number"
            placeholder="ID Estudiante"
            value={formulario.idEstudiante}
            onChange={handleChange}
            required
            disabled={!!editandoId}
          />
          <input
            name="idAsignatura"
            type="number"
            placeholder="ID Asignatura"
            value={formulario.idAsignatura}
            onChange={handleChange}
            required
            disabled={!!editandoId}
          />
          <select
            name="idEvaluacion"
            value={formulario.idEvaluacion}
            onChange={handleChange}
            required
            disabled={!!editandoId}
          >
            <option value="">Selecciona una evaluación</option>
            {evaluaciones.map((ev) => (
              <option key={ev.idEvaluacion} value={ev.idEvaluacion}>
                #{ev.idEvaluacion} - {ev.tipoEvaluacion} ({ev.asignatura?.nombreAsignatura})
              </option>
            ))}
          </select>
          <input
            name="calificacionObtenida"
            type="number"
            step="0.1"
            min="1"
            max="7"
            placeholder="Calificación (1.0-7.0)"
            value={formulario.calificacionObtenida}
            onChange={handleChange}
            required
          />
          <input
            name="observacionDocente"
            placeholder="Observación (opcional)"
            value={formulario.observacionDocente}
            onChange={handleChange}
            disabled={!!editandoId}
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar nota" : "Agregar nota"}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicion}>Cancelar</button>
          )}
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Asignatura</th>
              <th>Evaluación</th>
              <th>Calificación</th>
              <th>Observación</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {notas.map((n) => (
              <tr key={n.idNota}>
                <td>{n.idNota}</td>
                <td>{n.idEstudiante}</td>
                <td>{n.idAsignatura}</td>
                <td>{n.evaluacion?.idEvaluacion ?? "-"}</td>
                <td>{n.calificacionObtenida}</td>
                <td>{n.observacionDocente ?? "-"}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(n)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(n.idNota)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {notas.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 7 : 6}>No hay notas para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}