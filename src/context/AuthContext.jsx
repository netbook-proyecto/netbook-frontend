import { createContext, useContext, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

function decodificarToken(token) {
  try {
    const payload = token.split(".")[1];
    const datos = JSON.parse(atob(payload));
    return {
      correo: datos.sub,
      rol: datos.rol,
    };
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodificarToken(token);
  });

  async function login(correoInstitucional, contrasenia) {
    const response = await authApi.post("/login", {
      correoInstitucional,
      contrasenia,
    });

    const token = response.data;
    localStorage.setItem("token", token);

    const datosUsuario = decodificarToken(token);
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function registrar(correoInstitucional, contrasenia) {
    const response = await authApi.post("/register", {
      correoInstitucional,
      contrasenia,
    });
    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}