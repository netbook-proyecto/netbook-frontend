import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, User, Mail, CalendarDays, GraduationCap,
  Users, ClipboardList, AlertTriangle, ClipboardCheck, School,
  BookOpen, DoorOpen, BookText, NotebookPen, ListChecks,
  TrendingUp, FolderArchive, Stethoscope, Award, Settings,
  BarChart3, Search, LogOut,
} from "lucide-react";
import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
  ROLES_VER_ANOTACIONES,
  ROLES_VER_ACADEMICO,
  ROLES_VER_NOTAS,
  ROLES_VER_ASISTENCIA,
  ROLES_VER_VIDA,
  ROLES_VER_MENSAJERIA,
  ROLES_VER_EVENTOS,
  ROLES_VER_REPORTES,
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
      <button className="sidebar-hamburguesa" onClick={() => setAbierto((prev) => !prev)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {abierto && <div className="sidebar-overlay" onClick={cerrar} />}

      <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`}>
        <div className="sidebar-logo">
          <School size={22} color="#60a5fa" />
          <span className="sidebar-logo-texto">netBOOK</span>
        </div>

        {usuario && (
          <div className="sidebar-usuario">
            <div className="sidebar-avatar">{usuario.correo.charAt(0).toUpperCase()}</div>
            <div className="sidebar-usuario-info">
              <span className="sidebar-usuario-correo">{usuario.correo}</span>
              <span className="sidebar-usuario-rol">{usuario.rol}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">

          <p className="sidebar-seccion">Principal</p>
          <Link to="/dashboard" className={esActivo("/dashboard")} onClick={cerrar}>
            <LayoutDashboard size={18} /> Panel General
          </Link>
          <Link to="/mi-perfil" className={esActivo("/mi-perfil")} onClick={cerrar}>
            <User size={18} /> Mi Perfil
          </Link>

          {usuario && (
            <>
              {ROLES_VER_MENSAJERIA.includes(usuario.rol) && (
                <Link to="/mensajeria" className={esActivo("/mensajeria")} onClick={cerrar}>
                  <Mail size={18} /> Mensajería
                </Link>
              )}
              {ROLES_VER_EVENTOS.includes(usuario.rol) && (
                <Link to="/eventos" className={esActivo("/eventos")} onClick={cerrar}>
                  <CalendarDays size={18} /> Eventos
                </Link>
              )}

              {(ROLES_VER_ESTUDIANTES.includes(usuario.rol) ||
                ROLES_VER_APODERADOS.includes(usuario.rol) ||
                ROLES_MATRICULAS.includes(usuario.rol) ||
                ROLES_VER_ANOTACIONES.includes(usuario.rol)) && (
                <p className="sidebar-seccion">Gestión</p>
              )}

              {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
                <Link to="/estudiantes" className={esActivo("/estudiantes")} onClick={cerrar}>
                  <GraduationCap size={18} /> Estudiantes
                </Link>
              )}
              {ROLES_VER_APODERADOS.includes(usuario.rol) && (
                <Link to="/apoderados" className={esActivo("/apoderados")} onClick={cerrar}>
                  <Users size={18} /> Apoderados
                </Link>
              )}
              {ROLES_MATRICULAS.includes(usuario.rol) && (
                <Link to="/matriculas" className={esActivo("/matriculas")} onClick={cerrar}>
                  <ClipboardList size={18} /> Matrículas
                </Link>
              )}
              {ROLES_VER_ANOTACIONES.includes(usuario.rol) && (
                <Link to="/anotaciones" className={esActivo("/anotaciones")} onClick={cerrar}>
                  <AlertTriangle size={18} /> Anotaciones
                </Link>
              )}
              {ROLES_VER_ASISTENCIA.includes(usuario.rol) && (
                <Link to="/asistencia" className={esActivo("/asistencia")} onClick={cerrar}>
                  <ClipboardCheck size={18} /> Asistencia
                </Link>
              )}

              {ROLES_VER_ACADEMICO.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Académico</p>
                  <Link to="/cursos" className={esActivo("/cursos")} onClick={cerrar}>
                    <School size={18} /> Cursos
                  </Link>
                  <Link to="/niveles" className={esActivo("/niveles")} onClick={cerrar}>
                    <BookOpen size={18} /> Niveles
                  </Link>
                  <Link to="/salas" className={esActivo("/salas")} onClick={cerrar}>
                    <DoorOpen size={18} /> Salas
                  </Link>
                  <Link to="/asignaturas" className={esActivo("/asignaturas")} onClick={cerrar}>
                    <BookText size={18} /> Asignaturas
                  </Link>
                  <Link to="/bitacora" className={esActivo("/bitacora")} onClick={cerrar}>
                    <NotebookPen size={18} /> Bitácora
                  </Link>
                </>
              )}

              {ROLES_VER_NOTAS.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Evaluación</p>
                  <Link to="/evaluaciones" className={esActivo("/evaluaciones")} onClick={cerrar}>
                    <ListChecks size={18} /> Evaluaciones
                  </Link>
                  <Link to="/notas" className={esActivo("/notas")} onClick={cerrar}>
                    <TrendingUp size={18} /> Notas
                  </Link>
                </>
              )}

              {ROLES_VER_VIDA.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Hoja de Vida</p>
                  <Link to="/hoja-de-vida" className={esActivo("/hoja-de-vida")} onClick={cerrar}>
                    <FolderArchive size={18} /> Hoja de Vida
                  </Link>
                  <Link to="/antecedentes-medicos" className={esActivo("/antecedentes-medicos")} onClick={cerrar}>
                    <Stethoscope size={18} /> Antecedentes Médicos
                  </Link>
                  <Link to="/antecedentes-academicos" className={esActivo("/antecedentes-academicos")} onClick={cerrar}>
                    <Award size={18} /> Antecedentes Académicos
                  </Link>
                </>
              )}

              {ROLES_CONFIGURACION.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Sistema</p>
                  <Link to="/configuracion" className={esActivo("/configuracion")} onClick={cerrar}>
                    <Settings size={18} /> Configuración
                  </Link>
                </>
              )}

              {ROLES_VER_REPORTES.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Reportes</p>
                  <Link to="/reportes" className={esActivo("/reportes")} onClick={cerrar}>
                    <BarChart3 size={18} /> Reportes
                  </Link>
                  <Link to="/filtros-reporte" className={esActivo("/filtros-reporte")} onClick={cerrar}>
                    <Search size={18} /> Filtros de Reporte
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}