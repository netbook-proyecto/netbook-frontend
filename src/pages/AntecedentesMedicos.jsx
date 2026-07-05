import { useEffect, useState } from "react";
import vidaApi from "../api/vidaApi";
import { useAuth } from "../context/AuthContext";
import { ROLES_CRUD_VIDA, puedeEditar } from "../utils/permisos";

const FORMULARIO_VACIO = {
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
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  async function cargarAntecedentes() {
    try {
      const response = await vidaApi.get("/antecedente-medico");
      setAntecedentes(response.data);
    } catch (err) {
      setError("No se pudo cargar la lista de antecedentes médicos.");
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
    setEditandoId(antecedente.idAntecedenteMedico);
    setFormulario({
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
      if (editandoId) {
        await vidaApi.put("/antecedente-medico", {
          idAntecedenteMedico: editandoId,
          ...formulario,
        });
      } else {
        await vidaApi.post("/antecedente-medico", formulario);
      }

      cancelarEdicion();
      cargarAntecedentes();
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
      cargarAntecedentes();
    } catch (err) {
      setError("No se pudo eliminar el antecedente médico.");
    }
  }

  return (
    <div className="pagina">
      <h2>Antecedentes Médicos</h2>

      {puedeGestionar && (
        <form onSubmit={handleSubmit} className="formulario-inline">
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
                <td colSpan={puedeGestionar ? 7 : 6}>No hay antecedentes médicos para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
