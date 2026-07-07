import { useEffect, useState } from "react";
import eventosApi from "../api/eventosApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_EVENTOS, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idCreador: "",
  tituloEvento: "",
  descripcionEvento: "",
  tipoEvento: "Académico",
  visibilidad: "Todos",
  fechaEvento: "",
};

export default function Eventos() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_EVENTOS);

  const [eventos, setEventos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarEventos() {
    try {
      const response = await eventosApi.get("/evento");
      setEventos(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de eventos.");
    }
  }

  useEffect(() => {
    cargarEventos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(evento) {
    setEditandoId(evento.idEventoCalendario);
    setFormulario({
      idCreador: evento.idCreador,
      tituloEvento: evento.tituloEvento,
      descripcionEvento: evento.descripcionEvento,
      tipoEvento: evento.tipoEvento,
      visibilidad: evento.visibilidad,
      fechaEvento: evento.fechaEvento,
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
        idCreador: Number(formulario.idCreador),
      };
      if (editandoId) {
        await eventosApi.put("/evento", { ...datos, idEventoCalendario: editandoId });
      } else {
        await eventosApi.post("/evento", datos);
      }
      cancelarEdicion();
      cargarEventos();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar el evento.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este evento?")) return;
    try {
      await eventosApi.delete(`/evento/${id}`);
      cargarEventos();
    } catch (err) {
      setError("No se pudo eliminar el evento.");
    }
  }

  return (
    <div className="pagina">
      <h2>Eventos del calendario escolar</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="idCreador"
            type="number"
            placeholder="ID del creador"
            value={formulario.idCreador}
            onChange={handleChange}
            required
          />
          <input
            name="tituloEvento"
            placeholder="Título del evento"
            value={formulario.tituloEvento}
            onChange={handleChange}
            required
          />
          <input
            name="descripcionEvento"
            placeholder="Descripción"
            value={formulario.descripcionEvento}
            onChange={handleChange}
            required
          />
          <select name="tipoEvento" value={formulario.tipoEvento} onChange={handleChange} required>
            <option value="Académico">Académico</option>
            <option value="Extracurricular">Extracurricular</option>
            <option value="Reunión">Reunión</option>
            <option value="Feriado">Feriado</option>
          </select>
          <select name="visibilidad" value={formulario.visibilidad} onChange={handleChange} required>
            <option value="Todos">Todos</option>
            <option value="Docentes">Docentes</option>
            <option value="Apoderados">Apoderados</option>
            <option value="Estudiantes">Estudiantes</option>
          </select>
          <input
            name="fechaEvento"
            type="date"
            value={formulario.fechaEvento}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar evento" : "Agregar evento"}
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
              <th>Título</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Visibilidad</th>
              <th>Fecha</th>
              <th>Creador</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.idEventoCalendario}>
                <td>{e.idEventoCalendario}</td>
                <td>{e.tituloEvento}</td>
                <td>{e.descripcionEvento}</td>
                <td>{e.tipoEvento}</td>
                <td>{e.visibilidad}</td>
                <td>{e.fechaEvento}</td>
                <td>{e.idCreador}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(e)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(e.idEventoCalendario)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {eventos.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 8 : 7}>No hay eventos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}