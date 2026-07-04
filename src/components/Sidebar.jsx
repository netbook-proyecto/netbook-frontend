import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
  ROLES_VER_ANOTACIONES,
  ROLES_VER_ACADEMICO,
  ROLES_VER_NOTAS,
  ROLES_VER_ASISTENCIA,
  ROLES_VER_MENSAJERIA,
} from "../utils/permisos";

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function esActivo(path) {
    return location.pathname === path ? "sidebar-link activo" : "sidebar-link";
  }

  function cerrar() {
    setAbierto(false);
  }

  return (
    <>
      <button
        className="sidebar-hamburguesa"
        onClick={() => setAbierto((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {abierto && <div className="sidebar-overlay" onClick={cerrar} />}

      <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icono">🏫</span>
          <span className="sidebar-logo-texto">netBOOK</span>
        </div>

        {usuario && (
          <div className="sidebar-usuario">
            <div className="sidebar-avatar">
              {usuario.correo.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-usuario-info">
              <span className="sidebar-usuario-correo">{usuario.correo}</span>
              <span className="sidebar-usuario-rol">{usuario.rol}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <p className="sidebar-seccion">Principal</p>
          <Link to="/dashboard" className={esActivo("/dashboard")} onClick={cerrar}>
            📊 Panel General
          </Link>
          <Link to="/mi-perfil" className={esActivo("/mi-perfil")} onClick={cerrar}>
            👤 Mi Perfil
          </Link>
          {ROLES_VER_MENSAJERIA.includes(usuario.rol) && (
            <Link to="/mensajeria" className={esActivo("/mensajeria")} onClick={cerrar}>
              ✉️ Mensajería
            </Link>
          )}

          {usuario && (
            <>
              {(ROLES_VER_ESTUDIANTES.includes(usuario.rol) ||
                ROLES_VER_APODERADOS.includes(usuario.rol) ||
                ROLES_MATRICULAS.includes(usuario.rol) ||
                ROLES_VER_ANOTACIONES.includes(usuario.rol)) && (
                  <p className="sidebar-seccion">Gestión</p>
                )}

              {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
                <Link to="/estudiantes" className={esActivo("/estudiantes")} onClick={cerrar}>
                  👨‍🎓 Estudiantes
                </Link>
              )}
              {ROLES_VER_APODERADOS.includes(usuario.rol) && (
                <Link to="/apoderados" className={esActivo("/apoderados")} onClick={cerrar}>
                  👨‍👩‍👧 Apoderados
                </Link>
              )}
              {ROLES_MATRICULAS.includes(usuario.rol) && (
                <Link to="/matriculas" className={esActivo("/matriculas")} onClick={cerrar}>
                  📝 Matrículas
                </Link>
              )}
              {ROLES_VER_ANOTACIONES.includes(usuario.rol) && (
                <Link to="/anotaciones" className={esActivo("/anotaciones")} onClick={cerrar}>
                  ⚠️ Anotaciones
                </Link>
              )}
              {ROLES_VER_ASISTENCIA.includes(usuario.rol) && (
                <Link to="/asistencia" className={esActivo("/asistencia")} onClick={cerrar}>
                  📅 Asistencia
                </Link>
              )}


              {ROLES_VER_ACADEMICO.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Académico</p>
                  <Link to="/cursos" className={esActivo("/cursos")} onClick={cerrar}>
                    🏫 Cursos
                  </Link>
                  <Link to="/niveles" className={esActivo("/niveles")} onClick={cerrar}>
                    📚 Niveles
                  </Link>
                  <Link to="/salas" className={esActivo("/salas")} onClick={cerrar}>
                    🚪 Salas
                  </Link>
                  <Link to="/asignaturas" className={esActivo("/asignaturas")} onClick={cerrar}>
                    📖 Asignaturas
                  </Link>
                </>
              )}

              {ROLES_VER_NOTAS.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Evaluación</p>
                  <Link to="/evaluaciones" className={esActivo("/evaluaciones")} onClick={cerrar}>
                    📋 Evaluaciones
                  </Link>
                  <Link to="/notas" className={esActivo("/notas")} onClick={cerrar}>
                    📈 Notas
                  </Link>
                </>
              )}

              {ROLES_CONFIGURACION.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Sistema</p>
                  <Link to="/configuracion" className={esActivo("/configuracion")} onClick={cerrar}>
                    ⚙️ Configuración
                  </Link>
                </>
              )}
              {ROLES_VER_ACADEMICO.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Académico</p>
                  <Link to="/cursos" className={esActivo("/cursos")} onClick={cerrar}>
                    🏫 Cursos
                  </Link>
                  <Link to="/niveles" className={esActivo("/niveles")} onClick={cerrar}>
                    📚 Niveles
                  </Link>
                  <Link to="/salas" className={esActivo("/salas")} onClick={cerrar}>
                    🚪 Salas
                  </Link>
                  <Link to="/asignaturas" className={esActivo("/asignaturas")} onClick={cerrar}>
                    📖 Asignaturas
                  </Link>
                  <Link to="/bitacora" className={esActivo("/bitacora")} onClick={cerrar}>
                    📒 Bitácora
                  </Link>
                </>
              )}
            </>

          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
