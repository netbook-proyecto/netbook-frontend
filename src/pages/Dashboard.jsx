import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import estudiantesApi from "../api/estudiantesApi";
import academicoApi from "../api/academicoApi";
import anotacionesApi from "../api/anotacionesApi";

export default function Dashboard() {
  const { usuario } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [anotaciones, setAnotaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
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
        console.error("Error micro-estudiantes", err);
      }

      try {
        const [resC, resN] = await Promise.all([
          academicoApi.get("/cursos"),
          academicoApi.get("/notas"),
        ]);
        setCursos(resC.data);
        setNotas(resN.data);
      } catch (err) {
        console.error("Error micro-academico", err);
      }

      try {
        const resAn = await anotacionesApi.get("/anotaciones");
        setAnotaciones(resAn.data);
      } catch (err) {
        console.error("Error micro-anotaciones", err);
      }

      setCargando(false);
    }
    cargar();
  }, []);

  const matriculasActivas = matriculas.filter(
    (m) => m.estadoMatricula === "ACTIVA"
  ).length;

  const anotacionesNegativas = anotaciones.filter(
    (a) => a.tipoAnotacion === "Negativa"
  ).length;

  const ultimasMatriculas = [...matriculas].slice(-3).reverse();

  return (
    <div className="pagina">
      <div className="dashboard-header">
        <div>
          <h2>Panel General</h2>
          <p className="dashboard-bienvenida">
            Bienvenido, <strong>{usuario?.correo}</strong> — {usuario?.rol}
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

      {cargando && <p className="ayuda">Cargando datos del sistema...</p>}

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
          <div className="kpi-icono">🏫</div>
          <div className="kpi-info">
            <span className="kpi-numero">{cursos.length}</span>
            <span className="kpi-label">Cursos</span>
          </div>
        </div>
        <div className="kpi-tarjeta kpi-naranja">
          <div className="kpi-icono">📈</div>
          <div className="kpi-info">
            <span className="kpi-numero">{notas.length}</span>
            <span className="kpi-label">Notas registradas</span>
          </div>
        </div>
        <div className="kpi-tarjeta kpi-rojo">
          <div className="kpi-icono">⚠️</div>
          <div className="kpi-info">
            <span className="kpi-numero">{anotacionesNegativas}</span>
            <span className="kpi-label">Anotaciones negativas</span>
          </div>
        </div>
        <div className="kpi-tarjeta kpi-morado">
          <div className="kpi-icono">👨‍👩‍👧</div>
          <div className="kpi-info">
            <span className="kpi-numero">{apoderados.length}</span>
            <span className="kpi-label">Apoderados</span>
          </div>
        </div>
        <div className="kpi-tarjeta kpi-gris">
          <div className="kpi-icono">📋</div>
          <div className="kpi-info">
            <span className="kpi-numero">{matriculas.length}</span>
            <span className="kpi-label">Total Matrículas</span>
          </div>
        </div>
        <div className="kpi-tarjeta kpi-amarillo">
          <div className="kpi-icono">📝</div>
          <div className="kpi-info">
            <span className="kpi-numero">{anotaciones.length}</span>
            <span className="kpi-label">Total Anotaciones</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-seccion">
          <div className="dashboard-seccion-header">
            <h3>Últimas matrículas</h3>
            <Link to="/matriculas" className="dashboard-ver-mas">Ver todas →</Link>
          </div>
          <div className="tabla-wrapper">
            <table className="tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Estado</th>
                  <th>Año</th>
                </tr>
              </thead>
              <tbody>
                {ultimasMatriculas.map((m) => (
                  <tr key={m.idMatricula}>
                    <td>{m.idMatricula}</td>
                    <td>{m.estudiante?.nombres ?? "-"} {m.estudiante?.apellidoPaterno ?? ""}</td>
                    <td>
                      <span className={`badge ${m.estadoMatricula === "ACTIVA" ? "badge-verde" : "badge-gris"}`}>
                        {m.estadoMatricula}
                      </span>
                    </td>
                    <td>{m.annoAcademico}</td>
                  </tr>
                ))}
                {ultimasMatriculas.length === 0 && (
                  <tr><td colSpan={4}>No hay matrículas registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-seccion">
          <div className="dashboard-seccion-header">
            <h3>Acciones rápidas</h3>
          </div>
          <div className="acciones-rapidas">
            <Link to="/estudiantes" className="accion-rapida accion-azul">
              <span>👨‍🎓</span><span>Nuevo Estudiante</span>
            </Link>
            <Link to="/apoderados" className="accion-rapida accion-verde">
              <span>👨‍👩‍👧</span><span>Nuevo Apoderado</span>
            </Link>
            <Link to="/matriculas" className="accion-rapida accion-celeste">
              <span>📝</span><span>Nueva Matrícula</span>
            </Link>
            <Link to="/anotaciones" className="accion-rapida accion-naranja">
              <span>⚠️</span><span>Nueva Anotación</span>
            </Link>
            <Link to="/notas" className="accion-rapida accion-morado">
              <span>📈</span><span>Registrar Nota</span>
            </Link>
            <Link to="/cursos" className="accion-rapida accion-gris">
              <span>🏫</span><span>Ver Cursos</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-seccion-header" style={{marginTop: "2rem"}}>
        <h3>Estudiantes registrados</h3>
        <Link to="/estudiantes" className="dashboard-ver-mas">Ver todos →</Link>
      </div>
      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th><th>RUT</th><th>Nombre completo</th><th>Correo</th><th>Curso</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.slice(0, 5).map((est) => (
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
                  {est.idCurso
                    ? <span className="badge badge-azul">Curso {est.idCurso}</span>
                    : <span className="badge badge-gris">Sin asignar</span>
                  }
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr><td colSpan={5}>No hay estudiantes registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
