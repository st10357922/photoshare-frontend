import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Returns decoded token ({ id, role, exp }) or null if missing/expired/invalid
const readToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readToken);

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuth(jwtDecode(token));
  };
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  // Auto-logout when the token expires
  useEffect(() => {
    if (!auth) return;
    const t = setTimeout(logout, Math.max(auth.exp * 1000 - Date.now(), 0));
    return () => clearTimeout(t);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin: auth?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}
