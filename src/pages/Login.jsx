import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [correoInstitucional, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(correoInstitucional, contrasenia);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data || "No se pudo iniciar sesión. Revisa tus datos."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-layout">
      <div className="login-panel-izquierdo">
        <div className="login-brand">
          <span className="login-brand-icono">🏫</span>
          <span className="login-brand-nombre">netBOOK</span>
        </div>
        <div className="login-panel-texto">
          <h1>Sistema Integral de Gestión Estudiantil</h1>
          <p>Plataforma digital para la administración académica del Colegio Bernardo O'Higgins.</p>
        </div>
        <div className="login-features">
          <div className="login-feature">
            <span>📊</span>
            <span>Panel de control en tiempo real</span>
          </div>
          <div className="login-feature">
            <span>👨‍🎓</span>
            <span>Gestión completa de estudiantes</span>
          </div>
          <div className="login-feature">
            <span>📈</span>
            <span>Registro de notas y evaluaciones</span>
          </div>
          <div className="login-feature">
            <span>🔐</span>
            <span>Acceso seguro por roles</span>
          </div>
        </div>
      </div>

      <div className="login-panel-derecho">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-campo">
              <label>Correo institucional</label>
              <input
                type="email"
                value={correoInstitucional}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="alumno@colegio.cl"
                required
                autoComplete="email"
              />
            </div>
            <div className="login-campo">
              <label>Contraseña</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="mensaje-error">{String(error)}</p>}
            <button type="submit" className="login-boton" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
            <p className="login-registro">
              ¿No tienes cuenta?{" "}
              <Link to="/registro">Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
