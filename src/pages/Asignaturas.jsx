import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ACADEMICO, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  nombreAsignatura: "",
  horasSemanales: "",
  nivelRequerido: "",
  idCurso: "",
};

export default function Asignaturas() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_ACADEMICO);

  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarAsignaturas() {
    try {
      const response = await academicoApi.get("/asignaturas");
      setAsignaturas(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de asignaturas.");
    }
  }

  async function cargarCursos() {
    try {
      const response = await academicoApi.get("/cursos");
      setCursos(response.data);
    } catch (err) {
      // No bloqueamos la página si esto falla, solo el select queda vacío
    }
  }

  useEffect(() => {
    cargarAsignaturas();
    cargarCursos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(asignatura) {
    setEditandoId(asignatura.idAsignatura);
    setFormulario({
      nombreAsignatura: asignatura.nombreAsignatura,
      horasSemanales: asignatura.horasSemanales,
      nivelRequerido: asignatura.nivelRequerido,
      idCurso: asignatura.curso?.idCurso ?? "",
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
        horasSemanales: Number(formulario.horasSemanales),
        idCurso: Number(formulario.idCurso),
      };
      if (editandoId) {
        await academicoApi.put(`/asignaturas/${editandoId}`, datos);
      } else {
        await academicoApi.post("/asignaturas", datos);
      }
      cancelarEdicion();
      cargarAsignaturas();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar la asignatura.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta asignatura?")) return;
    try {
      await academicoApi.delete(`/asignaturas/${id}`);
      cargarAsignaturas();
    } catch (err) {
      setError("No se pudo eliminar la asignatura.");
    }
  }

  return (
    <div className="pagina">
      <h2>Asignaturas</h2>

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
            name="horasSemanales"
            type="number"
            placeholder="Horas semanales"
            value={formulario.horasSemanales}
            onChange={handleChange}
            required
          />
          <input
            name="nivelRequerido"
            placeholder="Nivel requerido"
            value={formulario.nivelRequerido}
            onChange={handleChange}
            required
          />
          <select name="idCurso" value={formulario.idCurso} onChange={handleChange} required>
            <option value="">Selecciona un curso</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>
                {c.letraCurso} - {c.annoAcademico}
              </option>
            ))}
          </select>
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar asignatura" : "Agregar asignatura"}
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
              <th>Horas/sem.</th>
              <th>Nivel requerido</th>
              <th>Curso</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {asignaturas.map((a) => (
              <tr key={a.idAsignatura}>
                <td>{a.idAsignatura}</td>
                <td>{a.nombreAsignatura}</td>
                <td>{a.horasSemanales}</td>
                <td>{a.nivelRequerido}</td>
                <td>{a.curso ? `${a.curso.letraCurso} - ${a.curso.annoAcademico}` : "-"}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(a)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(a.idAsignatura)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {asignaturas.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 6 : 5}>No hay asignaturas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}