import { useAuth } from "../context/AuthContext";

export default function MiPerfil() {
  const { usuario } = useAuth();

  return (
    <div className="pagina">
      <h2>Mi Perfil</h2>
      <div className="tarjeta-perfil">
        <p><strong>Correo institucional:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
      </div>
      <p className="ayuda">
        Próximamente aquí podrás ver tus notas, asistencia y datos personales
        completos, conectando con el endpoint correspondiente del backend.
      </p>
    </div>
  );
}