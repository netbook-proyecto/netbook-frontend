import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";

const FORMULARIO_VACIO = {
  fechaMatricula: "",
  annoAcademico: new Date().getFullYear(),
  estadoMatricula: "VIGENTE",
  tipoMatricula: "REGULAR",
  idEstudiante: "",
  idApoderado: "",
};

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarDatos() {
    try {
      const [resMatriculas, resEstudiantes, resApoderados] = await Promise.all([
        estudiantesApi.get("/matriculas"),
        estudiantesApi.get("/estudiantes"),
        estudiantesApi.get("/apoderados"),
      ]);
      setMatriculas(resMatriculas.data);
      setEstudiantes(resEstudiantes.data);
      setApoderados(resApoderados.data);
    } catch (err) {
      setError("No se pudo cargar la información de matrículas.");
    }
  }

  useEffect(() => {
    cargarDatos();
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
      const datosAEnviar = {
        ...formulario,
        annoAcademico: Number(formulario.annoAcademico),
        idEstudiante: Number(formulario.idEstudiante),
        idApoderado: Number(formulario.idApoderado),
      };
      await estudiantesApi.post("/matriculas", datosAEnviar);
      setFormulario(FORMULARIO_VACIO);
      cargarDatos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar la matrícula. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta matrícula?")) return;
    try {
      await estudiantesApi.delete(`/matriculas/${id}`);
      cargarDatos();
    } catch (err) {
      setError("No se pudo eliminar la matrícula.");
    }
  }

  return (
    <div className="pagina">
      <h2>Matrículas</h2>

      <form onSubmit={handleSubmit} className="formulario-inline">
        <input
          name="fechaMatricula"
          type="date"
          value={formulario.fechaMatricula}
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
        <select
          name="estadoMatricula"
          value={formulario.estadoMatricula}
          onChange={handleChange}
        >
          <option value="VIGENTE">VIGENTE</option>
          <option value="ANULADA">ANULADA</option>
          <option value="PENDIENTE">PENDIENTE</option>
        </select>
        <select
          name="tipoMatricula"
          value={formulario.tipoMatricula}
          onChange={handleChange}
        >
          <option value="REGULAR">REGULAR</option>
          <option value="ESPECIAL">ESPECIAL</option>
        </select>

        <select
          name="idEstudiante"
          value={formulario.idEstudiante}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona estudiante --</option>
          {estudiantes.map((est) => (
            <option key={est.idUsuario} value={est.idUsuario}>
              {est.nombres} {est.apellidoPaterno} ({est.rut})
            </option>
          ))}
        </select>

        <select
          name="idApoderado"
          value={formulario.idApoderado}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona apoderado --</option>
          {apoderados.map((ap) => (
            <option key={ap.idUsuario} value={ap.idUsuario}>
              {ap.nombres} {ap.apellidoPaterno} ({ap.rut})
            </option>
          ))}
        </select>

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Agregar matrícula"}
        </button>
      </form>

      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Año</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Estudiante</th>
            <th>Apoderado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map((mat) => (
            <tr key={mat.idMatricula}>
              <td>{mat.idMatricula}</td>
              <td>{mat.fechaMatricula}</td>
              <td>{mat.annoAcademico}</td>
              <td>{mat.estadoMatricula}</td>
              <td>{mat.tipoMatricula}</td>
              <td>{mat.estudiante?.nombres ?? "-"}</td>
              <td>{mat.apoderado?.nombres ?? "-"}</td>
              <td>
                <button
                  className="boton-peligro"
                  onClick={() => handleEliminar(mat.idMatricula)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {matriculas.length === 0 && (
            <tr>
              <td colSpan={8}>No hay matrículas registradas todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}