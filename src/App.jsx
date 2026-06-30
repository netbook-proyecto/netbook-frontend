import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaPrivada from "./components/RutaPrivada";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Estudiantes from "./pages/Estudiantes";
import Apoderados from "./pages/Apoderados";
import Matriculas from "./pages/Matriculas";
import MiPerfil from "./pages/MiPerfil";
import Configuracion from "./pages/Configuracion";
import SinPermiso from "./pages/SinPermiso";

import {
  ROLES_VER_ESTUDIANTES,
  ROLES_VER_APODERADOS,
  ROLES_MATRICULAS,
  ROLES_CONFIGURACION,
} from "./utils/permisos";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/sin-permiso" element={<SinPermiso />} />

          {/* Todos los roles logueados pueden ver su propio perfil */}
          <Route
            path="/mi-perfil"
            element={
              <RutaPrivada>
                <MiPerfil />
              </RutaPrivada>
            }
          />

          <Route
            path="/estudiantes"
            element={
              <RutaPrivada rolesPermitidos={ROLES_VER_ESTUDIANTES}>
                <Estudiantes />
              </RutaPrivada>
            }
          />
          <Route
            path="/apoderados"
            element={
              <RutaPrivada rolesPermitidos={ROLES_VER_APODERADOS}>
                <Apoderados />
              </RutaPrivada>
            }
          />
          <Route
            path="/matriculas"
            element={
              <RutaPrivada rolesPermitidos={ROLES_MATRICULAS}>
                <Matriculas />
              </RutaPrivada>
            }
          />
          <Route
            path="/configuracion"
            element={
              <RutaPrivada rolesPermitidos={ROLES_CONFIGURACION}>
                <Configuracion />
              </RutaPrivada>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;