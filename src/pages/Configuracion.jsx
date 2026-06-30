export default function Configuracion() {
  return (
    <div className="pagina">
      <h2>Configuración del Sistema</h2>
      <p>
        Aquí, como ADMIN, podrías gestionar usuarios del sistema y asignar
        roles a docentes e inspectores.
      </p>
      <p className="ayuda">
        (Sección de ejemplo: para que funcione de verdad, necesitarías un
        endpoint en micro-auth, por ejemplo GET /api/auth/usuarios, que liste
        todos los usuarios registrados.)
      </p>
    </div>
  );
}