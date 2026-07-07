import { useEffect, useState } from "react";
import anotacionesApi from "../api/anotacionesApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ANOTACIONES, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  tipoAnotacion: "Positiva",
  descripcionHechos: "",
  nivelGravedad: "Leve",
};

export default function Anotaciones() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_ANOTACIONES);

  const [anotaciones, setAnotaciones] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");

  async function cargarAnotaciones() {
    try {
      const response = await anotacionesApi.get("/anotaciones");
      setAnotaciones(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de anotaciones.");
    }
  }

  useEffect(() => {
    cargarAnotaciones();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(anotacion) {
    setEditandoId(anotacion.id);
    setFormulario({
      idEstudiante: anotacion.idEstudiante,
      tipoAnotacion: anotacion.tipoAnotacion,
      descripcionHechos: anotacion.descripcionHechos,
      nivelGravedad: anotacion.nivelGravedad,
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
        const datosActualizar = {
          tipoAnotacion: formulario.tipoAnotacion,
          descripcionHechos: formulario.descripcionHechos,
          nivelGravedad: formulario.nivelGravedad,
        };
        await anotacionesApi.put(`/anotaciones/${editandoId}`, datosActualizar);
      } else {
        const datosCrear = {
          ...formulario,
          idEstudiante: Number(formulario.idEstudiante),
        };
        await anotacionesApi.post("/anotaciones", datosCrear);
      }

      cancelarEdicion();
      cargarAnotaciones();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar la anotación. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta anotación?")) return;
    try {
      await anotacionesApi.delete(`/anotaciones/${id}`);
      cargarAnotaciones();
    } catch (err) {
      setError("No se pudo eliminar la anotación.");
    }
  }

  const anotacionesFiltradas = busquedaEstudiante
    ? anotaciones.filter(
        (a) => String(a.idEstudiante) === busquedaEstudiante.trim()
      )
    : anotaciones;

  return (
    <div className="pagina">
      <h2>Anotaciones</h2>

      <input
        className="buscador"
        placeholder="Buscar por ID de estudiante..."
        value={busquedaEstudiante}
        onChange={(e) => setBusquedaEstudiante(e.target.value)}
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

          <select
            name="tipoAnotacion"
            value={formulario.tipoAnotacion}
            onChange={handleChange}
            required
          >
            <option value="Positiva">Positiva</option>
            <option value="Negativa">Negativa</option>
          </select>

          <select
            name="nivelGravedad"
            value={formulario.nivelGravedad}
            onChange={handleChange}
            required
          >
            <option value="Leve">Leve</option>
            <option value="Menos grave">Menos grave</option>
            <option value="Grave">Grave</option>
          </select>

          <input
            name="descripcionHechos"
            placeholder="Descripción de los hechos (máx. 500 caracteres)"
            value={formulario.descripcionHechos}
            onChange={handleChange}
            maxLength={500}
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar anotación" : "Agregar anotación"}
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
              <th>ID Estudiante</th>
              <th>Tipo</th>
              <th>Gravedad</th>
              <th>Descripción</th>
              <th>Fecha</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {anotacionesFiltradas.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.idEstudiante}</td>
                <td>{a.tipoAnotacion}</td>
                <td>{a.nivelGravedad}</td>
                <td>{a.descripcionHechos}</td>
                <td>{a.fechaRegistro}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(a)}>
                      Editar
                    </button>
                    <button className="boton-peligro" onClick={() => handleEliminar(a.id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {anotacionesFiltradas.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 7 : 6}>No hay anotaciones para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}