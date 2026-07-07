import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [correoInstitucional, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { registrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await registrar(correoInstitucional, contrasenia);
      setMensaje(respuesta);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data || "No se pudo registrar el usuario.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor-formulario">
      <form onSubmit={handleSubmit} className="formulario">
        <h2>Crear cuenta</h2>
        <p className="ayuda">
          Tip: el rol se asigna según el correo. Debe contener "alumno",
          "docente", "inspector" o "directivo" (si no, queda como ADMIN).
        </p>

        <label>Correo institucional</label>
        <input
          type="email"
          value={correoInstitucional}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="alumno.juan@colegio.cl"
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
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Creando..." : "Registrarse"}
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}