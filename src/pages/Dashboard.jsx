import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import estudiantesApi from "../api/estudiantesApi";

export default function Dashboard() {
  const { usuario } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [matriculas, setMatriculas] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const [resE, resA, resM] = await Promise.all([
          estudiantesApi.get("/estudiantes"),
          estudiantesApi.get("/apoderados"),
          estudiantesApi.get("/matriculas"),
        ]);
        setEstudiantes(resE.data);
        setApoderados(resA.data);
        setMatriculas(resM.data);
      } catch (err) {
        console.error("Error cargando dashboard", err);
      }
    }
    cargar();
  }, []);

  const matriculasActivas = matriculas.filter(
    (m) => m.estadoMatricula === "ACTIVA"
  ).length;

  return (
    <div className="pagina">
      <div className="dashboard-header">
        <div>
          <h2>Panel General</h2>
          <p className="dashboard-bienvenida">
            Bienvenido, <strong>{usuario?.correo}</strong>
          </p>
        </div>
        <span className="dashboard-fecha">
          {new Date().toLocaleDateString("es-CL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="kpi-grid">
        <div className="kpi-tarjeta kpi-azul">
          <div className="kpi-icono">👨‍🎓</div>
          <div className="kpi-info">
            <span className="kpi-numero">{estudiantes.length}</span>
            <span className="kpi-label">Estudiantes</span>
          </div>
        </div>

        <div className="kpi-tarjeta kpi-verde">
          <div className="kpi-icono">✅</div>
          <div className="kpi-info">
            <span className="kpi-numero">{matriculasActivas}</span>
            <span className="kpi-label">Matrículas Activas</span>
          </div>
        </div>

        <div className="kpi-tarjeta kpi-celeste">
          <div className="kpi-icono">👨‍👩‍👧</div>
          <div className="kpi-info">
            <span className="kpi-numero">{apoderados.length}</span>
            <span className="kpi-label">Apoderados</span>
          </div>
        </div>

        <div className="kpi-tarjeta kpi-naranja">
          <div className="kpi-icono">📋</div>
          <div className="kpi-info">
            <span className="kpi-numero">{matriculas.length}</span>
            <span className="kpi-label">Total Matrículas</span>
          </div>
        </div>
      </div>

      <h3>Estudiantes registrados</h3>
      <div className="tabla-wrapper">
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
                <td>
                  <div className="tabla-avatar">
                    <span className="tabla-iniciales">
                      {est.nombres.charAt(0)}{est.apellidoPaterno.charAt(0)}
                    </span>
                    {est.nombres} {est.apellidoPaterno}
                  </div>
                </td>
                <td>{est.correoInstitucional}</td>
                <td>
                  {est.idCurso ? (
                    <span className="badge badge-azul">Curso {est.idCurso}</span>
                  ) : (
                    <span className="badge badge-gris">Sin asignar</span>
                  )}
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr>
                <td colSpan={5}>No hay estudiantes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}