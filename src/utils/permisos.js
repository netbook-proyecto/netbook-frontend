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

// Función de ayuda: ¿este rol puede hacer CRUD (crear/editar/eliminar)?
export function puedeEditar(rol, listaRolesConPermisoCrud) {
  return listaRolesConPermisoCrud.includes(rol);
}