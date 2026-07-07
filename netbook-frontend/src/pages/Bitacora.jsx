import { useEffect, useState } from "react";
import academicoApi from "../api/academicoApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_BITACORA } from "../utils/permisos";

const FORMULARIO_VACIO = {
  fechaClase: "",
  actividadesRealizadas: "",
  contenidosTratados: "",
  observacionesGenerales: "",
  idAsignatura: "",
};

export default function Bitacora() {
  const { usuario } = useAuth();
  const puedeGestionar = ROLES_CRUD_BITACORA.includes(usuario.rol);

  const [bitacoras, setBitacoras] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarBitacoras() {
    try {
      const response = await academicoApi.get("/bitacoras");
      setBitacoras(response.data);
    } catch (err) {
      setError("No se pudo cargar la bitácora.");
    }
  }

  useEffect(() => {
    cargarBitacoras();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await academicoApi.post("/bitacoras", {
        ...formulario,
        idAsignatura: Number(formulario.idAsignatura),
      });
      setFormulario(FORMULARIO_VACIO);
      cargarBitacoras();
    } catch (err) {
      setError("No se pudo guardar. Revisa que el ID de asignatura exista.");
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
    try {
      await academicoApi.delete(`/bitacoras/${id}`);
      cargarBitacoras();
    } catch (err) {
      setError("No se pudo eliminar.");
    }
  }

  return (
    <div className="pagina">
      <h2>Bitácora de Asignaturas</h2>

      {!puedeGestionar && (
        <p className="ayuda">
          Modo solo lectura. Tu rol ({usuario.rol}) no puede crear ni eliminar registros.
        </p>
      )}

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input name="fechaClase" type="date" value={formulario.fechaClase} onChange={handleChange} required />
          <input name="actividadesRealizadas" placeholder="Actividades realizadas" value={formulario.actividadesRealizadas} onChange={handleChange} required />
          <input name="contenidosTratados" placeholder="Contenidos tratados" value={formulario.contenidosTratados} onChange={handleChange} required />
          <input name="observacionesGenerales" placeholder="Observaciones (opcional)" value={formulario.observacionesGenerales} onChange={handleChange} />
          <input name="idAsignatura" type="number" placeholder="ID Asignatura" value={formulario.idAsignatura} onChange={handleChange} required />
          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Agregar registro"}
          </button>
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Actividades</th>
            <th>Contenidos</th>
            <th>Observaciones</th>
            <th>Asignatura</th>
            {puedeGestionar && <th></th>}
          </tr>
        </thead>
        <tbody>
          {bitacoras.map((b) => (
            <tr key={b.idBitacoraAsignatura}>
              <td>{b.idBitacoraAsignatura}</td>
              <td>{b.fechaClase}</td>
              <td>{b.actividadesRealizadas}</td>
              <td>{b.contenidosTratados}</td>
              <td>{b.observacionesGenerales ?? "-"}</td>
              <td>{b.asignatura?.nombreAsignatura ?? "-"}</td>
              {puedeGestionar && (
                <td>
                  <button className="boton-peligro" onClick={() => handleEliminar(b.idBitacoraAsignatura)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
          {bitacoras.length === 0 && (
            <tr>
              <td colSpan={puedeGestionar ? 7 : 6}>No hay registros todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}