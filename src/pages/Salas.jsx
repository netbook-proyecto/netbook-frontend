import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ACADEMICO, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = { nombreSala: "", capacidad: "" };

export default function Salas() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_ACADEMICO);

  const [salas, setSalas] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarSalas() {
    try {
      const response = await academicoApi.get("/salas");
      setSalas(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de salas.");
    }
  }

  useEffect(() => {
    cargarSalas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(sala) {
    setEditandoId(sala.idSala);
    setFormulario({ nombreSala: sala.nombreSala, capacidad: sala.capacidad });
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
      const datos = { ...formulario, capacidad: Number(formulario.capacidad) };
      if (editandoId) {
        await academicoApi.put(`/salas/${editandoId}`, datos);
      } else {
        await academicoApi.post("/salas", datos);
      }
      cancelarEdicion();
      cargarSalas();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar la sala.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta sala?")) return;
    try {
      await academicoApi.delete(`/salas/${id}`);
      cargarSalas();
    } catch (err) {
      setError("No se pudo eliminar la sala.");
    }
  }

  return (
    <div className="pagina">
      <h2>Salas</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="nombreSala"
            placeholder="Nombre de la sala"
            value={formulario.nombreSala}
            onChange={handleChange}
            required
          />
          <input
            name="capacidad"
            type="number"
            placeholder="Capacidad"
            value={formulario.capacidad}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar sala" : "Agregar sala"}
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
              <th>Capacidad</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {salas.map((s) => (
              <tr key={s.idSala}>
                <td>{s.idSala}</td>
                <td>{s.nombreSala}</td>
                <td>{s.capacidad}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(s)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(s.idSala)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {salas.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 4 : 3}>No hay salas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}