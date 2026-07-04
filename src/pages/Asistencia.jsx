import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ASISTENCIA } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  fecha: "",
  presente: "true",
  observacion: "",
};

export default function Asistencia() {
  const { usuario } = useAuth();
  const puedeGestionar = ROLES_CRUD_ASISTENCIA.includes(usuario.rol);

  const [registros, setRegistros] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarRegistros() {
    try {
      const response = await estudiantesApi.get("/asistencia");
      setRegistros(response.data);
    } catch (err) {
      setError("No se pudo cargar la asistencia.");
    }
  }

  useEffect(() => {
    cargarRegistros();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await estudiantesApi.post("/asistencia", {
        idEstudiante: Number(formulario.idEstudiante),
        fecha: formulario.fecha,
        presente: formulario.presente === "true",
        observacion: formulario.observacion || null,
      });
      setFormulario(FORMULARIO_VACIO);
      cargarRegistros();
    } catch (err) {
      setError("No se pudo guardar. Revisa que el ID de estudiante exista.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await estudiantesApi.delete(`/asistencia/${id}`);
      cargarRegistros();
    } catch (err) {
      setError("No se pudo eliminar.");
    }
  }

  return (
    <div className="pagina">
      <h2>Asistencia</h2>

      {!puedeGestionar && (
        <p className="ayuda">
          Modo solo lectura. Tu rol ({usuario.rol}) no puede registrar asistencia.
        </p>
      )}

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="idEstudiante"
            type="number"
            placeholder="ID Estudiante"
            value={formulario.idEstudiante}
            onChange={handleChange}
            required
          />
          <input
            name="fecha"
            type="date"
            value={formulario.fecha}
            onChange={handleChange}
            required
          />
          <select name="presente" value={formulario.presente} onChange={handleChange}>
            <option value="true">Presente</option>
            <option value="false">Ausente</option>
          </select>
          <input
            name="observacion"
            placeholder="Observación (opcional)"
            value={formulario.observacion}
            onChange={handleChange}
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Registrar"}
          </button>
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Estudiante</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Observación</th>
            {puedeGestionar && <th></th>}
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.idAsistencia}>
              <td>{r.idAsistencia}</td>
              <td>{r.idEstudiante}</td>
              <td>{r.fecha}</td>
              <td>{r.presente ? "✅ Presente" : "❌ Ausente"}</td>
              <td>{r.observacion ?? "-"}</td>
              {puedeGestionar && (
                <td>
                  <button className="boton-peligro" onClick={() => handleEliminar(r.idAsistencia)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
          {registros.length === 0 && (
            <tr>
              <td colSpan={puedeGestionar ? 6 : 5}>No hay registros de asistencia todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
