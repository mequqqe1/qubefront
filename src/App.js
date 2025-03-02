import React, { useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Profile from './components/Profile';
import NewRepairModal from './components/NewRepairModal';
import ProductTreeModal from './components/ProductTreeModal';
import ServicePage from './components/ServicePage';
import SalePage from './components/SalePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isNewRepairModalOpen, setIsNewRepairModalOpen] = useState(false);
  const [isProductTreeModalOpen, setIsProductTreeModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    console.log('Состояние авторизации обновлено:', true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleNewRepairClick = () => {
    setIsNewRepairModalOpen(true);
  };

  const handleProductsClick = () => {
    setIsProductTreeModalOpen(true);
  };

  const handleSaleClick = () => {
    navigate('/sale');
  };

  return (
    <div>
      {isAuthenticated && <Sidebar onNewRepairClick={handleNewRepairClick} onProductsClick={handleProductsClick} onSaleClick={handleSaleClick} />}
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/service" element={isAuthenticated ? <ServicePage token={localStorage.getItem('token')} /> : <Navigate to="/login" />} />
        <Route path="/sale" element={isAuthenticated ? <SalePage token={localStorage.getItem('token')} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>

      {isNewRepairModalOpen && (
        <NewRepairModal
          onClose={() => setIsNewRepairModalOpen(false)}
          token={localStorage.getItem('token')}
          onTaskCreated={(newTask) => console.log('Новый таск создан:', newTask)}
        />
      )}
      {isProductTreeModalOpen && (
        <ProductTreeModal
          onClose={() => setIsProductTreeModalOpen(false)}
          token={localStorage.getItem('token')}
        />
      )}
    </div>
  );
};

export default App;