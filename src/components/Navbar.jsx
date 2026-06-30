import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
          <Link to="/estudiantes">Estudiantes</Link>
          <Link to="/apoderados">Apoderados</Link>
          <Link to="/matriculas">Matrículas</Link>
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