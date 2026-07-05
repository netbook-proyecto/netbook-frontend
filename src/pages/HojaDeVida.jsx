import { useEffect, useState } from "react";
import vidaApi from "../api/vidaApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_VIDA, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  fechaAperturaExpediente: "",
  estadoExpediente: "Activo",
};

export default function HojaDeVida() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_VIDA);

  const [hojas, setHojas] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");

  const [notasAbiertasId, setNotasAbiertasId] = useState(null);
  const [notas, setNotas] = useState([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);

  async function cargarHojas() {
    try {
      const response = await vidaApi.get("/hoja-de-vida");
      setHojas(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de hojas de vida.");
    }
  }

  useEffect(() => {
    cargarHojas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(hoja) {
    setEditandoId(hoja.idHojaDeVida);
    setFormulario({
      idEstudiante: hoja.idEstudiante,
      fechaAperturaExpediente: hoja.fechaAperturaExpediente,
      estadoExpediente: hoja.estadoExpediente,
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
        idEstudiante: Number(formulario.idEstudiante),
        fechaAperturaExpediente: formulario.fechaAperturaExpediente,
        estadoExpediente: formulario.estadoExpediente,
      };

      if (editandoId) {
        await vidaApi.put("/hoja-de-vida", {
          idHojaDeVida: editandoId,
          ...datos,
        });
      } else {
        await vidaApi.post("/hoja-de-vida", datos);
      }

      cancelarEdicion();
      cargarHojas();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar la hoja de vida. Revisa los datos (¿el estudiante existe en micro-estudiantes?)."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta hoja de vida?")) return;
    try {
      await vidaApi.delete(`/hoja-de-vida/${id}`);
      cargarHojas();
    } catch (err) {
      setError("No se pudo eliminar la hoja de vida.");
    }
  }

  async function handleVerNotas(hoja) {
    if (notasAbiertasId === hoja.idHojaDeVida) {
      setNotasAbiertasId(null);
      setNotas([]);
      return;
    }

    setNotasAbiertasId(hoja.idHojaDeVida);
    setCargandoNotas(true);
    try {
      const response = await vidaApi.get(
        `/hoja-de-vida/antecedentes-academicos/${hoja.idEstudiante}`
      );
      setNotas(response.data);
    } catch (err) {
      setNotas([]);
    } finally {
      setCargandoNotas(false);
    }
  }

  const hojasFiltradas = busquedaEstudiante
    ? hojas.filter(
        (h) => String(h.idEstudiante) === busquedaEstudiante.trim()
      )
    : hojas;

  return (
    <div className="pagina">
      <h2>Hoja de Vida</h2>

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

          <input
            name="fechaAperturaExpediente"
            type="date"
            value={formulario.fechaAperturaExpediente}
            onChange={handleChange}
            required
          />

          <select
            name="estadoExpediente"
            value={formulario.estadoExpediente}
            onChange={handleChange}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Cerrado">Cerrado</option>
            <option value="En revisión">En revisión</option>
          </select>

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar hoja" : "Agregar hoja"}
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
              <th>Fecha Apertura</th>
              <th>Estado</th>
              <th></th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {hojasFiltradas.map((h) => (
              <>
                <tr key={h.idHojaDeVida}>
                  <td>{h.idHojaDeVida}</td>
                  <td>{h.idEstudiante}</td>
                  <td>{h.fechaAperturaExpediente}</td>
                  <td>{h.estadoExpediente}</td>
                  <td>
                    <button
                      className="boton-secundario"
                      onClick={() => handleVerNotas(h)}
                    >
                      {notasAbiertasId === h.idHojaDeVida ? "Ocultar notas" : "Ver notas"}
                    </button>
                  </td>
                  {puedeGestionar && (
                    <td>
                      <button className="boton-secundario" onClick={() => handleEditar(h)}>
                        Editar
                      </button>
                      <button
                        className="boton-peligro"
                        onClick={() => handleEliminar(h.idHojaDeVida)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
                {notasAbiertasId === h.idHojaDeVida && (
                  <tr key={`${h.idHojaDeVida}-notas`}>
                    <td colSpan={puedeGestionar ? 6 : 5}>
                      {cargandoNotas ? (
                        <p>Cargando notas...</p>
                      ) : notas.length === 0 ? (
                        <p>Este estudiante no tiene notas registradas en micro-academico.</p>
                      ) : (
                        <table className="tabla">
                          <thead>
                            <tr>
                              <th>ID Asignatura</th>
                              <th>Calificación</th>
                              <th>Estado</th>
                              <th>Fecha Registro</th>
                              <th>Observación Docente</th>
                            </tr>
                          </thead>
                          <tbody>
                            {notas.map((n) => (
                              <tr key={n.idNota}>
                                <td>{n.idAsignatura}</td>
                                <td>{n.calificacionObtenida}</td>
                                <td>{n.estadoNota}</td>
                                <td>{n.fechaRegistro}</td>
                                <td>{n.observacionDocente}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
            {hojasFiltradas.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 6 : 5}>No hay hojas de vida para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
