import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_VER_ANOTACIONES,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
  ROLES_VER_ACADEMICO,
  ROLES_VER_NOTAS,
  ROLES_VER_VIDA,
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

      {/* Botón Hamburguesa para Mobile */}
      <button
        className="navbar-hamburguesa"
        onClick={() => setMenuAbierto((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Contenedor principal de enlaces (Siempre visible para poder mostrar el login en móvil) */}
      <div className={`navbar-links ${menuAbierto ? "navbar-links--abierto" : ""}`}>

        {/* Solo mostrar estos enlaces si el usuario existe (está logueado) */}
        {usuario && (
          <>
            <Link to="/mi-perfil" onClick={cerrarMenu}>Mi Perfil</Link>

            {ROLES_VER_ESTUDIANTES.includes(usuario.rol) && (
              <Link to="/estudiantes" onClick={cerrarMenu}>Estudiantes</Link>
            )}

            {ROLES_VER_ANOTACIONES.includes(usuario.rol) && (
              <Link to="/anotaciones" onClick={cerrarMenu}>Anotaciones</Link>
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

            {ROLES_VER_ACADEMICO.includes(usuario.rol) && (
              <>
                <Link to="/niveles" onClick={cerrarMenu}>Niveles</Link>
                <Link to="/salas" onClick={cerrarMenu}>Salas</Link>
                <Link to="/cursos" onClick={cerrarMenu}>Cursos</Link>
                <Link to="/asignaturas" onClick={cerrarMenu}>Asignaturas</Link>
              </>
            )}

            {ROLES_VER_NOTAS.includes(usuario.rol) && (
              <>
                <Link to="/evaluaciones" onClick={cerrarMenu}>Evaluaciones</Link>
                <Link to="/notas" onClick={cerrarMenu}>Notas</Link>
              </>
            )}
            {ROLES_VER_VIDA.includes(usuario.rol) && (
              <>
                <Link to="/hoja-de-vida" onClick={cerrarMenu}>Hoja de Vida</Link>
                <Link to="/antecedentes-medicos" onClick={cerrarMenu}>Antecedentes Médicos</Link>
                <Link to="/antecedentes-academicos" onClick={cerrarMenu}>Antecedentes Académicos</Link>
              </>
            )}
          </>
        )}

        {/* Sección de usuario en versión Mobile */}
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

      {/* Sección de usuario en versión Desktop */}
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