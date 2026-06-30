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
      navigate("/estudiantes");
    } catch (err) {
      setError(
        err.response?.data || "No se pudo iniciar sesión. Revisa tus datos."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor-formulario">
      <form onSubmit={handleSubmit} className="formulario">
        <h2>Iniciar sesión</h2>

        <label>Correo institucional</label>
        <input
          type="email"
          value={correoInstitucional}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="alumno@colegio.cl"
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          required
        />

        {error && <p className="mensaje-error">{String(error)}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}