import { useEffect, useState } from "react";
import reportesApi from "../api/reportesApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_REPORTES, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  nombreAsignatura: "",
  periodoInicio: "",
  periodoFin: "",
  tipoReporte: "",
};

export default function FiltrosReporte() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_REPORTES);

  const [filtros, setFiltros] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarFiltros() {
    try {
      const response = await reportesApi.get("/filtroReporte");
      setFiltros(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de filtros de reporte.");
    }
  }

  useEffect(() => {
    cargarFiltros();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(filtro) {
    setEditandoId(filtro.idFiltroReporte);
    setFormulario({
      nombreAsignatura: filtro.nombreAsignatura,
      periodoInicio: filtro.periodoInicio,
      periodoFin: filtro.periodoFin,
      tipoReporte: filtro.tipoReporte,
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
        // OJO: a diferencia de reportes, aquí el id va en el body, no en la URL
        await reportesApi.put("/filtroReporte", {
          idFiltroReporte: editandoId,
          ...formulario,
        });
      } else {
        await reportesApi.post("/filtroReporte", formulario);
      }

      cancelarEdicion();
      cargarFiltros();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el filtro. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este filtro?")) return;
    try {
      await reportesApi.delete(`/filtroReporte/${id}`);
      cargarFiltros();
    } catch (err) {
      setError("No se pudo eliminar el filtro.");
    }
  }

  return (
    <div className="pagina">
      <h2>Filtros de Reporte</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="nombreAsignatura"
            placeholder="Nombre de la asignatura"
            value={formulario.nombreAsignatura}
            onChange={handleChange}
            required
          />

          <input
            name="periodoInicio"
            type="date"
            value={formulario.periodoInicio}
            onChange={handleChange}
            required
          />

          <input
            name="periodoFin"
            type="date"
            value={formulario.periodoFin}
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
              <th>Asignatura</th>
              <th>Período Inicio</th>
              <th>Período Fin</th>
              <th>Tipo Reporte</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtros.map((f) => (
              <tr key={f.idFiltroReporte}>
                <td>{f.idFiltroReporte}</td>
                <td>{f.nombreAsignatura}</td>
                <td>{f.periodoInicio}</td>
                <td>{f.periodoFin}</td>
                <td>{f.tipoReporte}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(f)}>
                      Editar
                    </button>
                    <button
                      className="boton-peligro"
                      onClick={() => handleEliminar(f.idFiltroReporte)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtros.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 6 : 5}>No hay filtros de reporte para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}