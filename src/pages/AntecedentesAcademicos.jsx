import { useEffect, useState } from "react";
import vidaApi from "../api/vidaApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_VIDA, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  procedenciaColegio: "",
  anioEgresoAnterior: "",
  promedioGeneral: "",
  observacionesConductuales: "",
};

export default function AntecedentesAcademicos() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_VIDA);

  const [antecedentes, setAntecedentes] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarAntecedentes() {
    try {
      const response = await vidaApi.get("/antecedente-academico");
      setAntecedentes(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de antecedentes académicos.");
    }
  }

  useEffect(() => {
    cargarAntecedentes();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(antecedente) {
    setEditandoId(antecedente.idAntecedenteAcademico);
    setFormulario({
      procedenciaColegio: antecedente.procedenciaColegio,
      anioEgresoAnterior: antecedente.anioEgresoAnterior,
      promedioGeneral: antecedente.promedioGeneral,
      observacionesConductuales: antecedente.observacionesConductuales,
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (editandoId) {
        await vidaApi.put("/antecedente-academico", {
          idAntecedenteAcademico: editandoId,
          ...formulario,
        });
      } else {
        await vidaApi.post("/antecedente-academico", formulario);
      }

      cancelarEdicion();
      cargarAntecedentes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el antecedente académico. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este antecedente académico?")) return;
    try {
      await vidaApi.delete(`/antecedente-academico/${id}`);
      cargarAntecedentes();
    } catch (err) {
      setError("No se pudo eliminar el antecedente académico.");
    }
  }

  return (
    <div className="pagina">
      <h2>Antecedentes Académicos</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
          <input
            name="procedenciaColegio"
            placeholder="Colegio de procedencia"
            value={formulario.procedenciaColegio}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <input
            name="anioEgresoAnterior"
            placeholder="Año de egreso anterior"
            value={formulario.anioEgresoAnterior}
            onChange={handleChange}
            required
          />

          <input
            name="promedioGeneral"
            placeholder="Promedio general"
            value={formulario.promedioGeneral}
            onChange={handleChange}
            required
          />

          <input
            name="observacionesConductuales"
            placeholder="Observaciones conductuales (máx. 200 caracteres)"
            value={formulario.observacionesConductuales}
            onChange={handleChange}
            maxLength={200}
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Agregar"}
          </button>

          {editandoId && (
            <button type="button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </form>
      )}

      {error && <p className="mensaje-error">{error}</p>}

      <div className="tabla-wrapper">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Colegio de Procedencia</th>
              <th>Año Egreso Anterior</th>
              <th>Promedio General</th>
              <th>Observaciones Conductuales</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {antecedentes.map((a) => (
              <tr key={a.idAntecedenteAcademico}>
                <td>{a.idAntecedenteAcademico}</td>
                <td>{a.procedenciaColegio}</td>
                <td>{a.anioEgresoAnterior}</td>
                <td>{a.promedioGeneral}</td>
                <td>{a.observacionesConductuales}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(a)}>
                      Editar
                    </button>
                    <button
                      className="boton-peligro"
                      onClick={() => handleEliminar(a.idAntecedenteAcademico)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {antecedentes.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 6 : 5}>No hay antecedentes académicos para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}