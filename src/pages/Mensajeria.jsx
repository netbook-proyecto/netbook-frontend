import { useEffect, useState } from "react";
import mensajeriaApi from "../api/mensajeriaApi";
import { useAuth } from "../context/AuthContext";

const FORMULARIO_VACIO = { correoReceptor: "", asunto: "", cuerpoMensaje: "" };

export default function Mensajeria() {
  const { usuario } = useAuth();

  const [vista, setVista] = useState("recibidos"); // "recibidos" | "enviados"
  const [mensajes, setMensajes] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  async function cargarMensajes(vistaActual) {
    try {
      const endpoint =
        vistaActual === "recibidos"
          ? `/mensajerias/receptor/${usuario.correo}`
          : `/mensajerias/emisor/${usuario.correo}`;
      const response = await mensajeriaApi.get(endpoint);
      setMensajes(response.data);
    } catch (err) {
      setError("No se pudo cargar la bandeja de mensajes.");
    }
  }

  useEffect(() => {
    cargarMensajes(vista);
  }, [vista]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEnviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await mensajeriaApi.post("/mensajerias", {
        correoEmisor: usuario.correo,
        correoReceptor: formulario.correoReceptor,
        asunto: formulario.asunto,
        cuerpoMensaje: formulario.cuerpoMensaje,
      });
      setFormulario(FORMULARIO_VACIO);
      setMostrarFormulario(false);
      setVista("enviados");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo enviar el mensaje.");
    } finally {
      setCargando(false);
    }
  }

  async function marcarComoLeido(mensaje) {
    try {
      await mensajeriaApi.put(`/mensajerias/${mensaje.idMensaje}`, {
        asunto: mensaje.asunto,
        cuerpoMensaje: mensaje.cuerpoMensaje,
        estadoLectura: "LEIDO",
      });
      cargarMensajes(vista);
    } catch (err) {
      setError("No se pudo marcar el mensaje como leído.");
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este mensaje?")) return;
    try {
      await mensajeriaApi.delete(`/mensajerias/${id}`);
      cargarMensajes(vista);
    } catch (err) {
      setError("No se pudo eliminar el mensaje.");
    }
  }

  return (
    <div className="pagina">
      <h2>Mensajería</h2>

      <div className="formulario-inline">
        <button
          className={vista === "recibidos" ? "" : "boton-secundario"}
          onClick={() => setVista("recibidos")}
        >
          Recibidos
        </button>
        <button
          className={vista === "enviados" ? "" : "boton-secundario"}
          onClick={() => setVista("enviados")}
        >
          Enviados
        </button>
        <button onClick={() => setMostrarFormulario((prev) => !prev)}>
          {mostrarFormulario ? "Cancelar" : "Nuevo mensaje"}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleEnviar} className="formulario-inline">
          <input
            name="correoReceptor"
            type="email"
            placeholder="Correo del destinatario"
            value={formulario.correoReceptor}
            onChange={handleChange}
            required
          />
          <input
            name="asunto"
            placeholder="Asunto"
            value={formulario.asunto}
            onChange={handleChange}
            required
          />
          <input
            name="cuerpoMensaje"
            placeholder="Escribe tu mensaje..."
            value={formulario.cuerpoMensaje}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>{vista === "recibidos" ? "De" : "Para"}</th>
              <th>Asunto</th>
              <th>Mensaje</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m) => (
              <tr key={m.idMensaje}>
                <td>{vista === "recibidos" ? m.correoEmisor : m.correoReceptor}</td>
                <td>{m.asunto}</td>
                <td>{m.cuerpoMensaje}</td>
                <td>{m.fechaEnvio}</td>
                <td>{m.estadoLectura}</td>
                <td>
                  {vista === "recibidos" && m.estadoLectura === "NO_LEIDO" && (
                    <button className="boton-secundario" onClick={() => marcarComoLeido(m)}>
                      Marcar leído
                    </button>
                  )}
                  <button className="boton-peligro" onClick={() => handleEliminar(m.idMensaje)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {mensajes.length === 0 && (
              <tr><td colSpan={6}>No hay mensajes {vista === "recibidos" ? "recibidos" : "enviados"}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}