import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen';


function App() {
  const { user } = useAuth();

  // Si hay usuario, mostrar la aplicación
  return (
      <BrowserRouter>
        <Routes>
          {/* Ruta del Login: Si ya hay usuario, lo manda a tareas, si no, muestra el login */}
          <Route 
            path="/" 
            element={!user ? <LoginScreen /> : <Navigate to="/tasks" replace />} 
          />
          
          {/* Ruta de Tareas: Si hay usuario, la muestra. Si no, lo devuelve al login */}
          <Route 
            path="/tasks" 
            element={user ? <TaskScreen /> : <Navigate to="/" replace />} 
          />
          
          {/* Ruta comodín por si escriben una URL que no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }


export default App;
