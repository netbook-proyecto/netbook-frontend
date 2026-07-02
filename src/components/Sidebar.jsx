import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
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

      {abierto && (
        <div
          className="sidebar-overlay"
          onClick={() => setAbierto(false)}
        />
      )}

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

          <Link
            to="/dashboard"
            className={esActivo("/dashboard")}
            onClick={() => setAbierto(false)}
          >
            <span></span> Panel General
          </Link>

          <Link
            to="/mi-perfil"
            className={esActivo("/mi-perfil")}
            onClick={() => setAbierto(false)}
          >
            <span>👤</span> Mi Perfil
          </Link>

          {usuario && (
            <>
              <p className="sidebar-seccion">Gestión</p>

              {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
                <Link
                  to="/estudiantes"
                  className={esActivo("/estudiantes")}
                  onClick={() => setAbierto(false)}
                >
                  <span></span> Estudiantes
                </Link>
              )}

              {ROLES_VER_APODERADOS.includes(usuario.rol) && (
                <Link
                  to="/apoderados"
                  className={esActivo("/apoderados")}
                  onClick={() => setAbierto(false)}
                >
                  <span></span> Apoderados
                </Link>
              )}

              {ROLES_MATRICULAS.includes(usuario.rol) && (
                <Link
                  to="/matriculas"
                  className={esActivo("/matriculas")}
                  onClick={() => setAbierto(false)}
                >
                  <span></span> Matrículas
                </Link>
              )}

              {ROLES_CONFIGURACION.includes(usuario.rol) && (
                <>
                  <p className="sidebar-seccion">Sistema</p>
                  <Link
                    to="/configuracion"
                    className={esActivo("/configuracion")}
                    onClick={() => setAbierto(false)}
                  >
                    <span></span> Configuración
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <span></span> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}