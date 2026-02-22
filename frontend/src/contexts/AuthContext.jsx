import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verificar sesión al cargar y cuando cambie localStorage
  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      try {
        const sessionObj = JSON.parse(session);
        setUser(sessionObj);
      } catch (error) {
        console.error("Error parsing user session:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [localStorage.getItem("user")]);

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (tokens.access_token) {
      localStorage.setItem("access_token", tokens.access_token);
    }
    if (tokens.refresh_token) {
      localStorage.setItem("refresh_token", tokens.refresh_token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
