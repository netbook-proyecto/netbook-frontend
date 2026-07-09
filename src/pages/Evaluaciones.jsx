import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_NOTAS, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  valorNota: 7,
  ponderacionPorcentaje: "",
  fechaEvaluacion: "",
  tipoEvaluacion: "",
  idAsignatura: "",
};

export default function Evaluaciones() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_NOTAS);

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarEvaluaciones() {
    try {
      const response = await academicoApi.get("/evaluaciones");
      setEvaluaciones(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de evaluaciones.");
    }
  }

  async function cargarAsignaturas() {
    try {
      const response = await academicoApi.get("/asignaturas");
      setAsignaturas(response.data);
    } catch (err) {
      // El select queda vacío si esto falla, no bloqueamos la página
    }
  }

  useEffect(() => {
    cargarEvaluaciones();
    cargarAsignaturas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(evaluacion) {
    setEditandoId(evaluacion.idEvaluacion);
    setFormulario({
      valorNota: evaluacion.valorNota,
      ponderacionPorcentaje: evaluacion.ponderacionPorcentaje,
      fechaEvaluacion: evaluacion.fechaEvaluacion,
      tipoEvaluacion: evaluacion.tipoEvaluacion,
      idAsignatura: evaluacion.asignatura?.idAsignatura ?? "",
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
      const datos = {
        ...formulario,
        valorNota: Number(formulario.valorNota),
        ponderacionPorcentaje: Number(formulario.ponderacionPorcentaje),
        idAsignatura: Number(formulario.idAsignatura),
      };
      if (editandoId) {
        await academicoApi.put(`/evaluaciones/${editandoId}`, datos);
      } else {
        await academicoApi.post("/evaluaciones", datos);
      }
      cancelarEdicion();
      cargarEvaluaciones();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar la evaluación.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta evaluación?")) return;
    try {
      await academicoApi.delete(`/evaluaciones/${id}`);
      cargarEvaluaciones();
    } catch (err) {
      setError("No se pudo eliminar la evaluación.");
    }
  }

  return (
    <div className="pagina">
      <h2>Evaluaciones</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <select name="idAsignatura" value={formulario.idAsignatura} onChange={handleChange} required>
            <option value="">Selecciona una asignatura</option>
            {asignaturas.map((a) => (
              <option key={a.idAsignatura} value={a.idAsignatura}>
                {a.nombreAsignatura}
              </option>
            ))}
          </select>
          <input
            name="tipoEvaluacion"
            placeholder="Tipo (ej: Prueba, Trabajo)"
            value={formulario.tipoEvaluacion}
            onChange={handleChange}
            required
          />
          <input
            name="ponderacionPorcentaje"
            type="number"
            placeholder="Ponderación %"
            value={formulario.ponderacionPorcentaje}
            onChange={handleChange}
            required
          />
          <input
            name="fechaEvaluacion"
            type="date"
            value={formulario.fechaEvaluacion}
            onChange={handleChange}
            required
          />
          <input
            name="valorNota"
            type="number"
            step="0.1"
            min="1"
            max="7"
            placeholder="Nota máxima (1.0-7.0)"
            value={formulario.valorNota}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar evaluación" : "Agregar evaluación"}
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
              <th>Asignatura</th>
              <th>Tipo</th>
              <th>Ponderación</th>
              <th>Fecha</th>
              <th>Nota máx.</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((e) => (
              <tr key={e.idEvaluacion}>
                <td>{e.idEvaluacion}</td>
                <td>{e.asignatura?.nombreAsignatura ?? "-"}</td>
                <td>{e.tipoEvaluacion}</td>
                <td>{e.ponderacionPorcentaje}%</td>
                <td>{e.fechaEvaluacion}</td>
                <td>{e.valorNota}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(e)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(e.idEvaluacion)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {evaluaciones.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 7 : 6}>No hay evaluaciones registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}