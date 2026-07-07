import { useEffect, useState } from "react";
import vidaApi from "../api/vidaApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_VIDA, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  procedenciaColegio: "",
  anioEgresoAnterior: "",
  promedioGeneral: "",
  observacionesConductuales: "",
};

export default function AntecedentesAcademicos() {
  const { usuario } = useAuth();
  const puedeGestionar = puedeEditar(usuario.rol, ROLES_CRUD_VIDA);

  const [antecedentes, setAntecedentes] = useState([]);
  const [hojas, setHojas] = useState([]);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarDatos() {
    try {
      const [resAnt, resHojas] = await Promise.all([
        vidaApi.get("/antecedente-academico"),
        vidaApi.get("/hoja-de-vida"),
      ]);
      setAntecedentes(resAnt.data);
      setHojas(resHojas.data);
    } catch (err) {
      setError("No se pudo cargar la información.");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar(antecedente) {
    setEditandoId(antecedente.idAntecedenteAcademico);
    setFormulario({
      idEstudiante: antecedente.idEstudiante,
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
      const datos = {
        idEstudiante: Number(formulario.idEstudiante),
        procedenciaColegio: formulario.procedenciaColegio,
        anioEgresoAnterior: formulario.anioEgresoAnterior,
        promedioGeneral: formulario.promedioGeneral,
        observacionesConductuales: formulario.observacionesConductuales,
      };

      if (editandoId) {
        // PUT va sin ID en la URL; el ID se manda en el body
        await vidaApi.put("/antecedente-academico", {
          idAntecedenteAcademico: editandoId,
          ...datos,
        });
      } else {
        await vidaApi.post("/antecedente-academico", datos);
      }

      cancelarEdicion();
      cargarDatos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el antecedente académico."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este antecedente?")) return;
    try {
      await vidaApi.delete(`/antecedente-academico/${id}`);
      cargarDatos();
    } catch (err) {
      setError("No se pudo eliminar el antecedente académico.");
    }
  }

  return (
    <div className="pagina">
      <h2>Antecedentes Académicos</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">

          <select
            name="idEstudiante"
            value={formulario.idEstudiante}
            onChange={handleChange}
            required
            disabled={!!editandoId}
          >
            <option value="">-- Selecciona estudiante --</option>
            {hojas.map((h) => (
              <option key={h.idHojaDeVida} value={h.idEstudiante}>
                Estudiante ID {h.idEstudiante}
              </option>
            ))}
          </select>

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
            placeholder="Observaciones conductuales"
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
              <th>Estudiante</th>
              <th>Colegio Procedencia</th>
              <th>Año Egreso</th>
              <th>Promedio</th>
              <th>Observaciones</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {antecedentes.map((a) => (
              <tr key={a.idAntecedenteAcademico}>
                <td>{a.idAntecedenteAcademico}</td>
                <td>{a.idEstudiante ? `Estudiante ID ${a.idEstudiante}` : "-"}</td>
                <td>{a.procedenciaColegio}</td>
                <td>{a.anioEgresoAnterior}</td>
                <td>{a.promedioGeneral}</td>
                <td>{a.observacionesConductuales}</td>
                {puedeGestionar && (
                  <td>
                    <button
                      className="boton-secundario"
                      onClick={() => handleEditar(a)}
                    >
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
                <td colSpan={puedeGestionar ? 7 : 6}>
                  No hay antecedentes académicos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}