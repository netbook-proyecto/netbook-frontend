import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, GraduationCap, Users, ShieldCheck, TrendingUp } from "lucide-react";

export default function MiPerfil() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        if (usuario.rol === "ESTUDIANTE") {
          const response = await estudiantesApi.get("/estudiantes");
          const encontrado = response.data.find(
            (e) => e.correoInstitucional === usuario.correo
          );
          setDatos(encontrado || null);
          if (encontrado) {
            try {
              const resNotas = await academicoApi.get(`/notas/estudiante/${encontrado.idUsuario}`);
              setNotas(resNotas.data);
            } catch { setNotas([]); }
          }
        }
        if (usuario.rol === "APODERADO") {
          const response = await estudiantesApi.get("/apoderados");
          const encontrado = response.data.find(
            (a) => a.correoInstitucional === usuario.correo
          );
          setDatos(encontrado || null);
        }
      } catch (err) {
        setDatos(null);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [usuario.rol, usuario.correo]);

  const inicial = usuario.correo.charAt(0).toUpperCase();

  const promedioNotas = notas.length > 0
    ? (notas.reduce((sum, n) => sum + n.calificacionObtenida, 0) / notas.length).toFixed(1)
    : null;

  return (
    <div className="pagina">
      <h2>Mi Perfil</h2>
      {cargando && <p className="ayuda">Cargando datos...</p>}

      <div className="perfil-header">
        <div className="perfil-avatar-grande">{inicial}</div>
        <div className="perfil-header-info">
          <h3>
            {datos
              ? `${datos.nombres} ${datos.apellidoPaterno} ${datos.apellidoMaterno ?? ""}`
              : usuario.correo}
          </h3>
          <span className="perfil-rol-badge">{usuario.rol}</span>
          <p className="perfil-correo">{usuario.correo}</p>
        </div>
      </div>

      <div className="perfil-grid">
        <div className="perfil-seccion">
          <h4 className="perfil-seccion-titulo">
            <ClipboardList size={16} /> Información de cuenta
          </h4>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Correo</span>
            <span className="perfil-dato-valor">{usuario.correo}</span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Rol en el sistema</span>
            <span className="perfil-dato-valor">{usuario.rol}</span>
          </div>
        </div>

        {datos && usuario.rol === "ESTUDIANTE" && (
          <div className="perfil-seccion">
            <h4 className="perfil-seccion-titulo">
              <GraduationCap size={16} /> Datos del estudiante
            </h4>
            <div className="perfil-dato">
              <span className="perfil-dato-label">RUT</span>
              <span className="perfil-dato-valor">{datos.rut}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nombre completo</span>
              <span className="perfil-dato-valor">{datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Fecha de nacimiento</span>
              <span className="perfil-dato-valor">{datos.fechaNacimiento ?? "—"}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Teléfono emergencia</span>
              <span className="perfil-dato-valor">{datos.telefonoEmergencia ?? "—"}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Curso asignado</span>
              <span className="perfil-dato-valor">
                {datos.idCurso
                  ? <span className="badge badge-azul">Curso {datos.idCurso}</span>
                  : <span className="badge badge-gris">Sin asignar</span>
                }
              </span>
            </div>
          </div>
        )}

        {datos && usuario.rol === "APODERADO" && (
          <div className="perfil-seccion">
            <h4 className="perfil-seccion-titulo">
              <Users size={16} /> Datos del apoderado
            </h4>
            <div className="perfil-dato">
              <span className="perfil-dato-label">RUT</span>
              <span className="perfil-dato-valor">{datos.rut}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nombre completo</span>
              <span className="perfil-dato-valor">{datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Parentesco</span>
              <span className="perfil-dato-valor">{datos.parentesco ?? "—"}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Teléfono</span>
              <span className="perfil-dato-valor">{datos.telefonoContacto ?? "—"}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Ocupación</span>
              <span className="perfil-dato-valor">{datos.ocupacion ?? "—"}</span>
            </div>
          </div>
        )}

        {(usuario.rol === "ADMIN" || usuario.rol === "DOCENTE" ||
          usuario.rol === "INSPECTOR" || usuario.rol === "DIRECTIVO") && (
          <div className="perfil-seccion">
            <h4 className="perfil-seccion-titulo">
              <ShieldCheck size={16} /> Permisos del sistema
            </h4>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nivel de acceso</span>
              <span className="perfil-dato-valor">
                {usuario.rol === "ADMIN" && "Acceso total al sistema"}
                {usuario.rol === "DOCENTE" && "Gestión académica y notas"}
                {usuario.rol === "INSPECTOR" && "Gestión disciplinaria"}
                {usuario.rol === "DIRECTIVO" && "Supervisión y reportes"}
              </span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Módulos disponibles</span>
              <span className="perfil-dato-valor">
                {usuario.rol === "ADMIN" && "Todos los módulos"}
                {usuario.rol === "DOCENTE" && "Estudiantes, Notas, Evaluaciones, Anotaciones"}
                {usuario.rol === "INSPECTOR" && "Estudiantes, Anotaciones, Matrículas"}
                {usuario.rol === "DIRECTIVO" && "Todos en modo lectura"}
              </span>
            </div>
          </div>
        )}
      </div>

      {usuario.rol === "ESTUDIANTE" && notas.length > 0 && (
        <div className="perfil-notas">
          <div className="perfil-notas-header">
            <h4 className="perfil-seccion-titulo">
              <TrendingUp size={16} /> Mis notas
            </h4>
            {promedioNotas && (
              <div className={`perfil-promedio ${parseFloat(promedioNotas) >= 4.0 ? "promedio-verde" : "promedio-rojo"}`}>
                <span className="promedio-numero">{promedioNotas}</span>
                <span className="promedio-label">Promedio</span>
              </div>
            )}
          </div>
          <div className="tabla-wrapper">
            <table className="tabla">
              <thead>
                <tr><th>Asignatura</th><th>Calificación</th><th>Observación</th></tr>
              </thead>
              <tbody>
                {notas.map((n) => (
                  <tr key={n.idNota}>
                    <td>{n.idAsignatura}</td>
                    <td>
                      <span className={`badge ${n.calificacionObtenida >= 4.0 ? "badge-verde" : "badge-rojo"}`}>
                        {n.calificacionObtenida}
                      </span>
                    </td>
                    <td>{n.observacionDocente ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {usuario.rol === "ESTUDIANTE" && !cargando && notas.length === 0 && datos && (
        <div className="perfil-notas">
          <h4 className="perfil-seccion-titulo">
            <TrendingUp size={16} /> Mis notas
          </h4>
          <p className="ayuda">Aún no tienes notas registradas en el sistema.</p>
        </div>
      )}
    </div>
  );
}