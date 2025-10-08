import React, { useState, useEffect } from 'react';
import { IoBulbOutline, IoBulb, IoWater } from 'react-icons/io5';
import Toast from '../../components/common/Toast';
import './ControlPanelPage.css';

interface ControlState { isAutoIrrigationOn: boolean; isAutoLightingOn: boolean; irrigationInterval: number; lightsOn: boolean; }
const staticControlState: ControlState = { isAutoIrrigationOn: true, isAutoLightingOn: true, irrigationInterval: 24, lightsOn: false };
const API_URL = 'https://api.example.com/controls';
const ACTIONS_URL = 'https://api.example.com/actions';

const ControlPanelPage: React.FC = () => {
  const [controls, setControls] = useState<ControlState | null>(null);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchControlState = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha na resposta da rede');
        const apiData = await response.json();
        setControls(apiData);
      } catch (error) {
        console.error("Falha ao buscar estado dos controles, usando dados estáticos.", error);
        setToast({ message: "Servidor indisponível. Usando configurações padrão.", type: 'error' });
        setControls(staticControlState);
      }
    };
    fetchControlState();
  }, []);

  const apiUpdate = async (updatedState: Partial<ControlState>) => {
    const response = await fetch(API_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedState),
    });
    if (!response.ok) throw new Error('Falha ao atualizar o estado no servidor.');
  };

  const handleStateChange = async <K extends keyof ControlState>(key: K, value: ControlState[K]) => {
    if (!controls) return;
    // const previousState = { ...controls };
    setToast(null);
    setControls(prev => prev ? ({ ...prev, [key]: value }) : null);

    try {
      await apiUpdate({ [key]: value });
      setToast({ message: 'Configuração salva com sucesso!', type: 'success' });
    } catch (error) {
      // setToast({ message: 'Falha no servidor. A alteração foi desfeita.', type: 'error' });
      // setControls(previousState);
    }
  };

  const handleManualIrrigation = async () => {
    if (isIrrigating || !controls) return;
    setIsIrrigating(true);
    setToast(null);

    try {
      const response = await fetch(ACTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'irrigate' }),
      });
      if (!response.ok) throw new Error('Falha ao acionar a irrigação.');
      setToast({ message: 'Sistema de irrigação acionado!', type: 'success' });
    } catch (error) {
      //   setToast({ message: 'Falha ao acionar irrigação.', type: 'error' });
    } finally {
      setTimeout(() => setIsIrrigating(false), 3000);
    }
  };

  if (!controls) {
    return <div className="loading-container">Carregando controles...</div>;
  }

  return (
    <div className="control-panel-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="control-panel-header">
        <h1>Painel de Controle</h1>
        <p>Gerencie os atuadores e as automações do seu cultivo.</p>
      </div>
      <div className="control-grid">
        <div className="control-card">
          <h2>Automações</h2>
          <div className="control-item">
            <label htmlFor="auto-irrigation">Irrigação Automática</label>
            <label className="switch">
              <input id="auto-irrigation" type="checkbox" checked={controls.isAutoIrrigationOn} onChange={(e) => handleStateChange('isAutoIrrigationOn', e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="control-item">
            <label htmlFor="auto-lighting">Iluminação Automática</label>
            <label className="switch">
              <input id="auto-lighting" type="checkbox" checked={controls.isAutoLightingOn} onChange={(e) => handleStateChange('isAutoLightingOn', e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="control-item-vertical">
            <label htmlFor="irrigation-interval">Intervalo de Irrigação (horas)</label>
            <input id="irrigation-interval" type="number" className="control-input" value={controls.irrigationInterval} onChange={(e) => handleStateChange('irrigationInterval', Number(e.target.value))} disabled={controls.isAutoIrrigationOn} />
          </div>
        </div>
        <div className="control-card">
          <h2>Controles Manuais</h2>
          <p className="manual-control-description">As ações manuais só são permitidas quando a automação correspondente está desligada.</p>
          <div className="manual-controls-wrapper">
            <button className={`icon-button ${isIrrigating ? 'irrigating' : ''}`} onClick={handleManualIrrigation} disabled={controls.isAutoIrrigationOn || isIrrigating} title="Irrigar Agora">
              <IoWater size={28} />
            </button>
            <button className="icon-button" onClick={() => handleStateChange('lightsOn', !controls.lightsOn)} disabled={controls.isAutoLightingOn} title={controls.lightsOn ? 'Apagar Luzes' : 'Acender Luzes'}>
              {controls.lightsOn ? <IoBulb size={28} className="light-on-icon" /> : <IoBulbOutline size={28} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;