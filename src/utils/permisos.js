// Roles que pueden ENTRAR a las páginas de gestión (aunque sea solo para mirar)
export const ROLES_VER_ESTUDIANTES = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_VER_APODERADOS = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];

// Roles que pueden CREAR/EDITAR/ELIMINAR (CRUD completo)
export const ROLES_CRUD_ESTUDIANTES = ["INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_APODERADOS = ["INSPECTOR", "DIRECTIVO", "ADMIN"];

// Matrículas: Docente NO tiene acceso (según la matriz)
export const ROLES_MATRICULAS = ["INSPECTOR", "DIRECTIVO", "ADMIN"];

// Configuración del sistema: solo Admin
export const ROLES_CONFIGURACION = ["ADMIN"];

// Anotaciones
export const ROLES_VER_ANOTACIONES = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ANOTACIONES = ["DOCENTE", "INSPECTOR", "ADMIN"];

// Académico: catálogo base (niveles, salas, cursos, asignaturas)
export const ROLES_VER_ACADEMICO = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ACADEMICO = ["INSPECTOR", "ADMIN"];

// Evaluaciones y Notas
export const ROLES_VER_NOTAS = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_NOTAS = ["DOCENTE", "ADMIN"];

// Bitácora
export const ROLES_VER_BITACORA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_BITACORA = ["DOCENTE", "INSPECTOR", "ADMIN"];

// Asistencia
export const ROLES_VER_ASISTENCIA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ASISTENCIA = ["DOCENTE", "INSPECTOR", "ADMIN"];

// Hoja de Vida (antecedentes generales, médicos y académicos del estudiante)
export const ROLES_VER_VIDA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_VIDA = ["INSPECTOR", "DIRECTIVO", "ADMIN"];

// Función de ayuda: ¿este rol puede hacer CRUD (crear/editar/eliminar)?
// Normaliza mayúsculas/minúsculas y espacios extra para evitar falsos negativos
// si el backend manda el rol con formato distinto (ej: "admin", " ADMIN ", "Admin").
export function puedeEditar(rol, listaRolesConPermisoCrud) {
  if (!rol) return false;
  const rolNormalizado = rol.trim().toUpperCase();
  return listaRolesConPermisoCrud
    .map((r) => r.trim().toUpperCase())
    .includes(rolNormalizado);
}