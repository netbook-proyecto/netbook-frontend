import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ACADEMICO, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = { nombreNivel: "" };

export default function Niveles() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_ACADEMICO);

  const [niveles, setNiveles] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarNiveles() {
    try {
      const response = await academicoApi.get("/niveles");
      setNiveles(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de niveles.");
    }
  }

  useEffect(() => {
    cargarNiveles();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(nivel) {
    setEditandoId(nivel.idNivel);
    setFormulario({ nombreNivel: nivel.nombreNivel });
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
        await academicoApi.put(`/niveles/${editandoId}`, formulario);
      } else {
        await academicoApi.post("/niveles", formulario);
      }
      cancelarEdicion();
      cargarNiveles();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar el nivel.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este nivel?")) return;
    try {
      await academicoApi.delete(`/niveles/${id}`);
      cargarNiveles();
    } catch (err) {
      setError("No se pudo eliminar el nivel.");
    }
  }

  return (
    <div className="pagina">
      <h2>Niveles</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="nombreNivel"
            placeholder="Nombre del nivel (ej: 1° Básico)"
            value={formulario.nombreNivel}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar nivel" : "Agregar nivel"}
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
              <th>Nombre</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {niveles.map((n) => (
              <tr key={n.idNivel}>
                <td>{n.idNivel}</td>
                <td>{n.nombreNivel}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(n)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(n.idNivel)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {niveles.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 3 : 2}>No hay niveles registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}