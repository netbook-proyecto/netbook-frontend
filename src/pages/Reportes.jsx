import { useEffect, useState } from "react";
import reportesApi from "../api/reportesApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_REPORTES, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  nombreReporte: "",
  tipoReporte: "",
  descripcionReporte: "",
  estadoReporte: "Generado",
};

export default function Reportes() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_REPORTES);

  const [reportes, setReportes] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarReportes() {
    try {
      const response = await reportesApi.get("/reportes");
      setReportes(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de reportes.");
    }
  }

  useEffect(() => {
    cargarReportes();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(reporte) {
    setEditandoId(reporte.idReporte);
    setFormulario({
      nombreReporte: reporte.nombreReporte,
      tipoReporte: reporte.tipoReporte,
      descripcionReporte: reporte.descripcionReporte,
      estadoReporte: reporte.estadoReporte,
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
        // OJO: a diferencia de filtroReporte, aquí el id va en la URL, no en el body
        await reportesApi.put(`/reportes/${editandoId}`, formulario);
      } else {
        await reportesApi.post("/reportes", formulario);
      }

      cancelarEdicion();
      cargarReportes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el reporte. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este reporte?")) return;
    try {
      await reportesApi.delete(`/reportes/${id}`);
      cargarReportes();
    } catch (err) {
      setError("No se pudo eliminar el reporte.");
    }
  }

  return (
    <div className="pagina">
      <h2>Reportes</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="nombreReporte"
            placeholder="Nombre del reporte"
            value={formulario.nombreReporte}
            onChange={handleChange}
            required
          />

          <input
            name="tipoReporte"
            placeholder="Tipo (ej: BITACORA, ACADEMICO, ASISTENCIA)"
            value={formulario.tipoReporte}
            onChange={handleChange}
            required
          />

          <input
            name="descripcionReporte"
            placeholder="Descripción"
            value={formulario.descripcionReporte}
            onChange={handleChange}
            required
          />

          <select
            name="estadoReporte"
            value={formulario.estadoReporte}
            onChange={handleChange}
            required
          >
            <option value="Generado">Generado</option>
            <option value="En proceso">En proceso</option>
            <option value="Archivado">Archivado</option>
          </select>

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Agregar"}
          </button>

          {editandoId && (
            <button type="button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.idReporte}>
                <td>{r.idReporte}</td>
                <td>{r.nombreReporte}</td>
                <td>{r.tipoReporte}</td>
                <td>{r.descripcionReporte}</td>
                <td>{r.estadoReporte}</td>
                <td>{r.fechaReporte}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(r)}>
                      Editar
                    </button>
                    <button
                      className="boton-peligro"
                      onClick={() => handleEliminar(r.idReporte)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {reportes.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 7 : 6}>No hay reportes para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}