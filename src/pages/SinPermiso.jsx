import { Link } from "react-router-dom";

export default function SinPermiso() {
  return (
    <div className="pagina">
      <h2>No tienes permiso para ver esta sección</h2>
      <p>Tu rol actual no tiene acceso a esta página.</p>
      <Link to="/mi-perfil">Volver a mi perfil</Link>
    </div>
  );
}