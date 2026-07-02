import { useEffect, useState } from "react";
import estudiantesApi from "../api/estudiantesApi";
import { useAuth } from "../context/AuthContext";

export default function MiPerfil() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);

      try {
        if (usuario.rol === "ESTUDIANTE") {
          const response = await estudiantesApi.get("/estudiantes");
          const lista = response.data;
          const encontrado = lista.find(
            (e) => e.correoInstitucional === usuario.correo
          );
          setDatos(encontrado || null);
        }

        if (usuario.rol === "APODERADO") {
          const response = await estudiantesApi.get("/apoderados");
          const lista = response.data;
          const encontrado = lista.find(
            (a) => a.correoInstitucional === usuario.correo
          );
          setDatos(encontrado || null);
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
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
      </div>

      {cargando && <p>Cargando datos...</p>}

      {(usuario.rol === "ADMIN" ||
        usuario.rol === "DOCENTE" ||
        usuario.rol === "INSPECTOR" ||
        usuario.rol === "DIRECTIVO") && (
        <div className="tarjeta-perfil">
          <p>Tienes acceso completo al sistema como <strong>{usuario.rol}</strong>.</p>
        </div>
      )}

      {datos && usuario.rol === "ESTUDIANTE" && (
        <div className="tarjeta-perfil">
          <p><strong>RUT:</strong> {datos.rut}</p>
          <p><strong>Nombre:</strong> {datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
          <p><strong>Curso:</strong> {datos.idCurso ?? "Sin asignar"}</p>
        </div>
      )}

      {datos && usuario.rol === "APODERADO" && (
        <div className="tarjeta-perfil">
          <p><strong>RUT:</strong> {datos.rut}</p>
          <p><strong>Nombre:</strong> {datos.nombres} {datos.apellidoPaterno} {datos.apellidoMaterno}</p>
          <p><strong>Teléfono:</strong> {datos.telefonoContacto}</p>
        </div>
      )}

      {!cargando && !datos &&
        usuario.rol !== "ADMIN" &&
        usuario.rol !== "DOCENTE" &&
        usuario.rol !== "INSPECTOR" &&
        usuario.rol !== "DIRECTIVO" && (
        <p className="ayuda">No se encontraron datos para tu usuario.</p>
      )}
    </div>
  );
}