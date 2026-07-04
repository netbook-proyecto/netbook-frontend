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

// Anotaciones: Docente, Inspector, Directivo y Admin pueden ENTRAR a ver
// (asumido igual que Estudiantes; ajusta si tu profe pide otra cosa)
export const ROLES_VER_ANOTACIONES = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ANOTACIONES = ["DOCENTE", "INSPECTOR", "ADMIN"];

// Académico: catálogo base (niveles, salas, cursos, asignaturas)
export const ROLES_VER_ACADEMICO = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ACADEMICO = ["INSPECTOR", "ADMIN"];

// Evaluaciones y Notas: las gestiona quien califica
export const ROLES_VER_NOTAS = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_NOTAS = ["DOCENTE", "ADMIN"];

// Bitácora: Docente puede ver y crear (es quien registra la clase)
export const ROLES_VER_BITACORA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_BITACORA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];

// Asistencia: Inspector y Docente pueden registrar
export const ROLES_VER_ASISTENCIA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN"];
export const ROLES_CRUD_ASISTENCIA = ["DOCENTE", "INSPECTOR", "ADMIN"];

// Mensajería: todos los roles logueados pueden usarla (enviar y ver los propios)
export const ROLES_VER_MENSAJERIA = ["DOCENTE", "INSPECTOR", "DIRECTIVO", "ADMIN", "ESTUDIANTE"];

// Función de ayuda: ¿este rol puede hacer CRUD (crear/editar/eliminar)?
export function puedeEditar(rol, listaRolesConPermisoCrud) {
  return listaRolesConPermisoCrud.includes(rol);
}