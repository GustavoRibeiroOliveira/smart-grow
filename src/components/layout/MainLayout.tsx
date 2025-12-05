import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from '../common/Toast';

const API_BASE_URL = 'https://smartgrow-ajtn.onrender.com';

const MainLayout: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status_sistema`);
        if (response.ok) {
          const statusData = await response.json();
          
          if (statusData.nivel_reservatorio_cm > 26) {
            setToast({ message: "Nível do reservatório está baixo!", type: 'error' });
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status do sistema no layout:", error);
      }
    };

    checkSystemStatus();

    const interval = setInterval(checkSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;