import { useEffect, useState } from "react";
import vidaApi from "../api/vidaApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_VIDA, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
  idEstudiante: "",
  tipoSangre: "",
  alergias: "",
  enfermedadesCronicas: "",
  medicamentosActuales: "",
  indicacionesEmergencia: "",
};

export default function AntecedentesMedicos() {
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
        vidaApi.get("/antecedente-medico"),
        vidaApi.get("/hoja-de-vida"),
      ]);
      setAntecedentes(resAnt.data);
      setHojas(resHojas.data);
    } catch (err) {
      setError("No se pudo cargar la lista de antecedentes médicos.");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  // El GET devuelve los nombres "de base de datos" (grupoSanguineo, alergiasConocidas, etc.)
  function handleEditar(antecedente) {
    setEditandoId(antecedente.idAntecedenteMedico);
    setFormulario({
      idEstudiante: antecedente.idEstudiante,
      tipoSangre: antecedente.grupoSanguineo,
      alergias: antecedente.alergiasConocidas,
      enfermedadesCronicas: antecedente.condicionesCronicasMedicas,
      medicamentosActuales: antecedente.medicamentosRegulares,
      indicacionesEmergencia: antecedente.indicacionesDeEmergencia,
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
      // El POST/PUT esperan los nombres del DTO (tipoSangre, alergias, etc.),
      // NO los nombres de la entidad/base de datos.
      const datos = {
        idEstudiante: Number(formulario.idEstudiante),
        tipoSangre: formulario.tipoSangre,
        alergias: formulario.alergias,
        enfermedadesCronicas: formulario.enfermedadesCronicas,
        medicamentosActuales: formulario.medicamentosActuales,
        indicacionesEmergencia: formulario.indicacionesEmergencia,
      };

      if (editandoId) {
        // El PUT va sin ID en la URL; el ID va en el body como idAntecedenteMedico
        await vidaApi.put("/antecedente-medico", {
          idAntecedenteMedico: editandoId,
          ...datos,
        });
      } else {
        await vidaApi.post("/antecedente-medico", datos);
      }

      cancelarEdicion();
      cargarDatos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el antecedente médico. Revisa los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar este antecedente médico?")) return;
    try {
      await vidaApi.delete(`/antecedente-medico/${id}`);
      cargarDatos();
    } catch (err) {
      setError("No se pudo eliminar el antecedente médico.");
    }
  }

  return (
    <div className="pagina">
      <h2>Antecedentes Médicos</h2>

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
            name="tipoSangre"
            placeholder="Grupo sanguíneo (ej: O+)"
            value={formulario.tipoSangre}
            onChange={handleChange}
            maxLength={10}
            required
          />

          <input
            name="alergias"
            placeholder="Alergias conocidas"
            value={formulario.alergias}
            onChange={handleChange}
            required
          />

          <input
            name="enfermedadesCronicas"
            placeholder="Condiciones/enfermedades crónicas"
            value={formulario.enfermedadesCronicas}
            onChange={handleChange}
            required
          />

          <input
            name="medicamentosActuales"
            placeholder="Medicamentos regulares"
            value={formulario.medicamentosActuales}
            onChange={handleChange}
            required
          />

          <input
            name="indicacionesEmergencia"
            placeholder="Indicaciones de emergencia"
            value={formulario.indicacionesEmergencia}
            onChange={handleChange}
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
              <th>Grupo Sanguíneo</th>
              <th>Alergias</th>
              <th>Condiciones Crónicas</th>
              <th>Medicamentos</th>
              <th>Indicaciones de Emergencia</th>
              {puedeGestionar && <th></th>}
            </tr>
          </thead>
          <tbody>
            {antecedentes.map((a) => (
              <tr key={a.idAntecedenteMedico}>
                <td>{a.idAntecedenteMedico}</td>
                <td>{a.idEstudiante ? `Estudiante ID ${a.idEstudiante}` : "-"}</td>
                <td>{a.grupoSanguineo}</td>
                <td>{a.alergiasConocidas}</td>
                <td>{a.condicionesCronicasMedicas}</td>
                <td>{a.medicamentosRegulares}</td>
                <td>{a.indicacionesDeEmergencia}</td>
                {puedeGestionar && (
                  <td>
                    <button className="boton-secundario" onClick={() => handleEditar(a)}>
                      Editar
                    </button>
                    <button
                      className="boton-peligro"
                      onClick={() => handleEliminar(a.idAntecedenteMedico)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {antecedentes.length === 0 && (
              <tr>
                <td colSpan={puedeGestionar ? 8 : 7}>No hay antecedentes médicos para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}