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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-marca">Sistema Escolar</div>

      {usuario && (
        <div className="navbar-links">
          <Link to="/mi-perfil">Mi Perfil</Link>

          {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
            <Link to="/estudiantes">Estudiantes</Link>
          )}

          {ROLES_VER_APODERADOS.includes(usuario.rol) && (
            <Link to="/apoderados">Apoderados</Link>
          )}

          {ROLES_MATRICULAS.includes(usuario.rol) && (
            <Link to="/matriculas">Matrículas</Link>
          )}

          {ROLES_CONFIGURACION.includes(usuario.rol) && (
            <Link to="/configuracion">Configuración</Link>
          )}
        </div>
      )}

      <div className="navbar-usuario">
        {usuario ? (
          <>
            <span>
              {usuario.correo} ({usuario.rol})
            </span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}