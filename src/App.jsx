import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaPrivada from "./components/RutaPrivada";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Anotaciones from "./pages/Anotaciones";
import Mensajeria from "./pages/Mensajeria";
import Apoderados from "./pages/Apoderados";
import Matriculas from "./pages/Matriculas";
import MiPerfil from "./pages/MiPerfil";
import Configuracion from "./pages/Configuracion";
import SinPermiso from "./pages/SinPermiso";
import Niveles from "./pages/Niveles";
import Salas from "./pages/Salas";
import Cursos from "./pages/Cursos";
import Asignaturas from "./pages/Asignaturas";
import Evaluaciones from "./pages/Evaluaciones";
import Notas from "./pages/Notas";
import Bitacora from "./pages/Bitacora";
import Asistencia from "./pages/Asistencia";
import HojaDeVida from "./pages/HojaDeVida";
import AntecedentesMedicos from "./pages/AntecedentesMedicos";
import AntecedentesAcademicos from "./pages/AntecedentesAcademicos";

import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_VER_ANOTACIONES,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
  ROLES_VER_ACADEMICO,
  ROLES_VER_NOTAS,
  ROLES_VER_BITACORA,
  ROLES_VER_VIDA,
  ROLES_VER_ASISTENCIA,
  ROLES_VER_MENSAJERIA,
} from "./utils/permisos";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/sin-permiso" element={<SinPermiso />} />

          <Route path="/dashboard" element={
            <RutaPrivada>
              <Layout><Dashboard /></Layout>
            </RutaPrivada>
          } />

          <Route path="/mi-perfil" element={
            <RutaPrivada>
              <Layout><MiPerfil /></Layout>
            </RutaPrivada>
          } />

          <Route path="/estudiantes" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ESTUDIANTES}>
              <Layout><Estudiantes /></Layout>
            </RutaPrivada>
          } />

          <Route path="/apoderados" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_APODERADOS}>
              <Layout><Apoderados /></Layout>
            </RutaPrivada>
          } />

          <Route path="/anotaciones" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ANOTACIONES}>
              <Layout><Anotaciones /></Layout>
            </RutaPrivada>
          } />
          <Route path="/mensajeria" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_MENSAJERIA}>
              <Layout><Mensajeria /></Layout>
            </RutaPrivada>
          } />

          <Route path="/matriculas" element={
            <RutaPrivada rolesPermitidos={ROLES_MATRICULAS}>
              <Layout><Matriculas /></Layout>
            </RutaPrivada>
          } />

          <Route path="/configuracion" element={
            <RutaPrivada rolesPermitidos={ROLES_CONFIGURACION}>
              <Layout><Configuracion /></Layout>
            </RutaPrivada>
          } />

          <Route path="/niveles" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ACADEMICO}>
              <Layout><Niveles /></Layout>
            </RutaPrivada>
          } />

          <Route path="/salas" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ACADEMICO}>
              <Layout><Salas /></Layout>
            </RutaPrivada>
          } />

          <Route path="/cursos" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ACADEMICO}>
              <Layout><Cursos /></Layout>
            </RutaPrivada>
          } />

          <Route path="/asignaturas" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ACADEMICO}>
              <Layout><Asignaturas /></Layout>
            </RutaPrivada>
          } />

          <Route path="/evaluaciones" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_NOTAS}>
              <Layout><Evaluaciones /></Layout>
            </RutaPrivada>
          } />

          <Route path="/notas" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_NOTAS}>
              <Layout><Notas /></Layout>
            </RutaPrivada>
          } />

          <Route path="/bitacora" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_BITACORA}>
              <Layout><Bitacora /></Layout>
            </RutaPrivada>
          } />

          <Route path="/asistencia" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_ASISTENCIA}>
              <Layout><Asistencia /></Layout>
            </RutaPrivada>
          } />

          <Route path="/hoja-de-vida" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_VIDA}>
              <Layout><HojaDeVida /></Layout>
            </RutaPrivada>
          } />

          <Route path="/antecedentes-medicos" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_VIDA}>
              <Layout><AntecedentesMedicos /></Layout>
            </RutaPrivada>
          } />

          <Route path="/antecedentes-academicos" element={
            <RutaPrivada rolesPermitidos={ROLES_VER_VIDA}>
              <Layout><AntecedentesAcademicos /></Layout>
            </RutaPrivada>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;