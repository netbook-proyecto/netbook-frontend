import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_ACADEMICO, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  letraCurso: "",
  annoAcademico: new Date().getFullYear(),
  jornada: "Mañana",
  cuposMaximos: "",
};

export default function Cursos() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_ACADEMICO);

  const [cursos, setCursos] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarCursos() {
    try {
      const response = await academicoApi.get("/cursos");
      setCursos(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de cursos.");
    }
  }

  useEffect(() => {
    cargarCursos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(curso) {
    setEditandoId(curso.idCurso);
    setFormulario({
      letraCurso: curso.letraCurso,
      annoAcademico: curso.annoAcademico,
      jornada: curso.jornada,
      cuposMaximos: curso.cuposMaximos,
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
        annoAcademico: Number(formulario.annoAcademico),
        cuposMaximos: Number(formulario.cuposMaximos),
      };
      if (editandoId) {
        await academicoApi.put(`/cursos/${editandoId}`, datos);
      } else {
        await academicoApi.post("/cursos", datos);
      }
      cancelarEdicion();
      cargarCursos();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar el curso.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este curso?")) return;
    try {
      await academicoApi.delete(`/cursos/${id}`);
      cargarCursos();
    } catch (err) {
      setError("No se pudo eliminar el curso.");
    }
  }

  return (
    <div className="pagina">
      <h2>Cursos</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="letraCurso"
            placeholder="Letra (ej: A)"
            value={formulario.letraCurso}
            onChange={handleChange}
            required
          />
          <input
            name="annoAcademico"
            type="number"
            placeholder="Año académico"
            value={formulario.annoAcademico}
            onChange={handleChange}
            required
          />
          <select name="jornada" value={formulario.jornada} onChange={handleChange} required>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </select>
          <input
            name="cuposMaximos"
            type="number"
            placeholder="Cupos máximos"
            value={formulario.cuposMaximos}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar curso" : "Agregar curso"}
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
              <th>Curso</th>
              <th>Año</th>
              <th>Jornada</th>
              <th>Cupos</th>
              <th>Nivel</th>
              <th>Sala</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.idCurso}>
                <td>{c.idCurso}</td>
                <td>{c.letraCurso}</td>
                <td>{c.annoAcademico}</td>
                <td>{c.jornada}</td>
                <td>{c.cuposMaximos}</td>
                <td>{c.nivel?.nombreNivel ?? "-"}</td>
                <td>{c.sala?.nombreSala ?? "-"}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(c)}>Editar</button>
                    <button className="boton-peligro" onClick={() => handleEliminar(c.idCurso)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr><td colSpan={puedeGestionar ? 8 : 7}>No hay cursos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}