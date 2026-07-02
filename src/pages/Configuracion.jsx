import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";

export default function Configuracion() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resEstudiantes, resApoderados] = await Promise.all([
          estudiantesApi.get("/estudiantes"),
          estudiantesApi.get("/apoderados"),
        ]);
        setEstudiantes(resEstudiantes.data);
        setApoderados(resApoderados.data);
      } catch (err) {
        setError("No se pudo cargar la información del sistema.");
      }
    }
    cargarDatos();
  }, []);

  return (
    <div className="pagina">
      <h2>Configuración del Sistema</h2>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tarjeta-perfil">
        <p><strong>Total estudiantes:</strong> {estudiantes.length}</p>
        <p><strong>Total apoderados:</strong> {apoderados.length}</p>
      </div>

      <h3>Estudiantes registrados</h3>
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Curso</th>
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
            </tr>
          ))}
          {estudiantes.length === 0 && (
            <tr>
              <td colSpan={5}>No hay estudiantes registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Apoderados registrados</h3>
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre completo</th>
            <th>Parentesco</th>
            <th>Teléfono</th>
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
            </tr>
          ))}
          {apoderados.length === 0 && (
            <tr>
              <td colSpan={5}>No hay apoderados registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}