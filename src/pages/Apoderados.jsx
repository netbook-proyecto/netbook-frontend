import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";

const FORMULARIO_VACIO = {
  rut: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  correoInstitucional: "",
  parentesco: "",
  telefonoContacto: "",
  ocupacion: "",
};

export default function Apoderados() {
  const [apoderados, setApoderados] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarApoderados() {
    try {
      const response = await estudiantesApi.get("/apoderados");
      setApoderados(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de apoderados.");
    }
  }

  useEffect(() => {
    cargarApoderados();
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
      await estudiantesApi.post("/apoderados", formulario);
      setFormulario(FORMULARIO_VACIO);
      cargarApoderados();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el apoderado. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este apoderado?")) return;
    try {
      await estudiantesApi.delete(`/apoderados/${id}`);
      cargarApoderados();
    } catch (err) {
      setError("No se pudo eliminar el apoderado.");
    }
  }

  return (
    <div className="pagina">
      <h2>Apoderados</h2>

      <form onSubmit={handleSubmit} className="formulario-inline">
        <input name="rut" placeholder="RUT" value={formulario.rut} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={formulario.nombres} onChange={handleChange} required />
        <input name="apellidoPaterno" placeholder="Apellido paterno" value={formulario.apellidoPaterno} onChange={handleChange} required />
        <input name="apellidoMaterno" placeholder="Apellido materno" value={formulario.apellidoMaterno} onChange={handleChange} required />
        <input name="correoInstitucional" type="email" placeholder="Correo institucional" value={formulario.correoInstitucional} onChange={handleChange} required />
        <input name="parentesco" placeholder="Parentesco (ej: Madre)" value={formulario.parentesco} onChange={handleChange} required />
        <input name="telefonoContacto" placeholder="Teléfono de contacto" value={formulario.telefonoContacto} onChange={handleChange} required />
        <input name="ocupacion" placeholder="Ocupación" value={formulario.ocupacion} onChange={handleChange} required />

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Agregar apoderado"}
        </button>
      </form>

      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre completo</th>
            <th>Parentesco</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {apoderados.map((ap) => (
            <tr key={ap.idUsuario}>
              <td>{ap.idUsuario}</td>
              <td>{ap.rut}</td>
              <td>{ap.nombres} {ap.apellidoPaterno} {ap.apellidoMaterno}</td>
              <td>{ap.parentesco}</td>
              <td>{ap.telefonoContacto}</td>
              <td>
                <button className="boton-peligro" onClick={() => handleEliminar(ap.idUsuario)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {apoderados.length === 0 && (
            <tr>
              <td colSpan={6}>No hay apoderados registrados todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}