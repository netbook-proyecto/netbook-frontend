import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";

export default function MiPerfil() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);

      try {
        if (usuario.rol === "DOCENTE") {
          const response = await academicoApi.get("/docentes/mi-perfil", {
            params: { correo: usuario.correo },
          });
          setDatos(response.data);
        }

        if (usuario.rol === "ESTUDIANTE") {
          const response = await estudiantesApi.get("/estudiantes/mi-perfil", {
            params: { correo: usuario.correo },
          });
          setDatos(response.data);
        }

        if (usuario.rol === "APODERADO") {
          const response = await estudiantesApi.get("/apoderados/mi-perfil", {
            params: { correo: usuario.correo },
          });
          setDatos(response.data);
        }
      } catch (err) {
        setDatos(null);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [usuario.rol, usuario.correo]);

  return (
    <div className="pagina">
      <h2>Mi Perfil</h2>

      <div className="tarjeta-perfil">
        <p><strong>Correo institucional:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
      </div>

      {cargando && <p>Cargando datos...</p>}

      {datos && usuario.rol === "DOCENTE" && (
        <div className="tarjeta-perfil">
          <p><strong>RUT:</strong> {datos.rut}</p>
          <p><strong>Nombre completo:</strong> {datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
          <p><strong>Título profesional:</strong> {datos.tituloProfesional}</p>
          <p><strong>Especialidad:</strong> {datos.especialidad}</p>
        </div>
      )}

      {datos && usuario.rol === "ESTUDIANTE" && (
        <div className="tarjeta-perfil">
          <p><strong>RUT:</strong> {datos.rut}</p>
          <p><strong>Nombre completo:</strong> {datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
          <p><strong>Curso:</strong> {datos.idCurso ?? "Sin asignar"}</p>
        </div>
      )}

      {datos && usuario.rol === "APODERADO" && (
        <div className="tarjeta-perfil">
          <p><strong>RUT:</strong> {datos.rut}</p>
          <p><strong>Nombre completo:</strong> {datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
          <p><strong>Teléfono de contacto:</strong> {datos.telefonoContacto}</p>
        </div>
      )}

      {!cargando && !datos && (
        <p className="ayuda">
          Todavía no hay datos adicionales cargados para tu usuario.
        </p>
      )}
    </div>
  );
}