import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";

const FORMULARIO_VACIO = {
  rut: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  correoInstitucional: "",
  fechaNacimiento: "",
  telefonoEmergencia: "",
  idCurso: "",
};

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarEstudiantes() {
    try {
      const response = await estudiantesApi.get("/estudiantes");
      setEstudiantes(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de estudiantes.");
    }
  }

  useEffect(() => {
    cargarEstudiantes();
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
        idCurso: formulario.idCurso ? Number(formulario.idCurso) : null,
      };
      await estudiantesApi.post("/estudiantes", datosAEnviar);
      setFormulario(FORMULARIO_VACIO);
      cargarEstudiantes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el estudiante. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este estudiante?")) return;
    try {
      await estudiantesApi.delete(`/estudiantes/${id}`);
      cargarEstudiantes();
    } catch (err) {
      setError("No se pudo eliminar el estudiante.");
    }
  }

  return (
    <div className="pagina">
      <h2>Estudiantes</h2>

      <form onSubmit={handleSubmit} className="formulario-inline">
        <input name="rut" placeholder="RUT (ej: 12345678-9)" value={formulario.rut} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={formulario.nombres} onChange={handleChange} required />
        <input name="apellidoPaterno" placeholder="Apellido paterno" value={formulario.apellidoPaterno} onChange={handleChange} required />
        <input name="apellidoMaterno" placeholder="Apellido materno" value={formulario.apellidoMaterno} onChange={handleChange} required />
        <input name="correoInstitucional" type="email" placeholder="Correo institucional" value={formulario.correoInstitucional} onChange={handleChange} required />
        <input name="fechaNacimiento" type="date" value={formulario.fechaNacimiento} onChange={handleChange} required />
        <input name="telefonoEmergencia" placeholder="Teléfono de emergencia" value={formulario.telefonoEmergencia} onChange={handleChange} required />
        <input name="idCurso" type="number" placeholder="ID Curso (opcional)" value={formulario.idCurso} onChange={handleChange} />

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Agregar estudiante"}
        </button>
      </form>

      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Curso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <tr key={est.idUsuario}>
              <td>{est.idUsuario}</td>
              <td>{est.rut}</td>
              <td>{est.nombres} {est.apellidoPaterno} {est.apellidoMaterno}</td>
              <td>{est.correoInstitucional}</td>
              <td>{est.idCurso ?? "-"}</td>
              <td>
                <button className="boton-peligro" onClick={() => handleEliminar(est.idUsuario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {estudiantes.length === 0 && (
            <tr>
              <td colSpan={6}>No hay estudiantes registrados todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}