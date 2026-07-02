import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
} from "../utils/permisos";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMenuAbierto(false);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-marca">Sistema Escolar</div>

      <button
        className="navbar-hamburguesa"
        onClick={() => setMenuAbierto((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {usuario && (
        <div className={`navbar-links ${menuAbierto ? "navbar-links--abierto" : ""}`}>
          <Link to="/mi-perfil" onClick={cerrarMenu}>Mi Perfil</Link>

          {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
            <Link to="/estudiantes" onClick={cerrarMenu}>Estudiantes</Link>
          )}

          {ROLES_VER_APODERADOS.includes(usuario.rol) && (
            <Link to="/apoderados" onClick={cerrarMenu}>Apoderados</Link>
          )}

          {ROLES_MATRICULAS.includes(usuario.rol) && (
            <Link to="/matriculas" onClick={cerrarMenu}>Matrículas</Link>
          )}

          {ROLES_CONFIGURACION.includes(usuario.rol) && (
            <Link to="/configuracion" onClick={cerrarMenu}>Configuración</Link>
          )}

          <div className="navbar-usuario-mobile">
            {usuario ? (
              <>
                <span>{usuario.correo} ({usuario.rol})</span>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </>
            ) : (
              <Link to="/login" onClick={cerrarMenu}>Iniciar sesión</Link>
            )}
          </div>
        </div>
      )}

      <div className="navbar-usuario">
        {usuario ? (
          <>
            <span>{usuario.correo} ({usuario.rol})</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}