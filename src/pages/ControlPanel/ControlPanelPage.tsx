import React, { useState, useEffect } from 'react';
import { IoBulbOutline, IoBulb, IoWater } from 'react-icons/io5';
import Toast from '../../components/common/Toast';
import './ControlPanelPage.css';

interface ControlState {
  isAutoIrrigationOn: boolean;
  isAutoLightingOn: boolean;
  irrigationInterval: number;
  lightsOn: boolean;
}

const API_BASE_URL = 'https://smartgrow-ajtn.onrender.com';

const ControlPanelPage: React.FC = () => {
  const [controls, setControls] = useState<ControlState | null>(null);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchControlState = async () => {
      try {
        const [automacaoRes, statusRes] = await Promise.all([
          fetch(`${API_BASE_URL}/configuracao/automacao`),
          fetch(`${API_BASE_URL}/status_sistema`)
        ]);

        if (!automacaoRes.ok || !statusRes.ok) throw new Error('Falha na resposta da rede');

        const automacaoData = await automacaoRes.json();
        const statusData = await statusRes.json();

        setControls({
          isAutoIrrigationOn: automacaoData.irrigacao,
          isAutoLightingOn: automacaoData.iluminacao,
          lightsOn: statusData.nivel_iluminacao > 0,
          irrigationInterval: 24 
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setToast({ message: "Falha ao conectar com a Estufa.", type: 'error' });
      }
    };
    fetchControlState();
  }, []);

  const handleStateChange = async <K extends keyof ControlState>(key: K, value: ControlState[K]) => {
    if (!controls) return;
    const previousState = { ...controls };
    
    setControls(prev => prev ? ({ ...prev, [key]: value }) : null);
    setToast(null);

    if (key === 'irrigationInterval') return;

    try {
      if (key === 'isAutoIrrigationOn' || key === 'isAutoLightingOn') {
        const sistema = key === 'isAutoIrrigationOn' ? 'irrigacao' : 'iluminacao';
        
        const response = await fetch(`${API_BASE_URL}/configuracao/automacao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sistema, ativo: value }),
        });

        if (!response.ok) throw new Error('Falha na API');
        setToast({ message: 'Configuração salva com sucesso!', type: 'success' });
      }
    } catch (error) {
      setToast({ message: 'Falha no servidor. Revertendo.', type: 'error' });
      setControls(previousState);
    }
  };

  const toggleLights = async () => {
    if (!controls) return;
    const newValue = !controls.lightsOn;
    
    setControls(prev => prev ? ({ ...prev, lightsOn: newValue }) : null);

    try {
      const response = await fetch(`${API_BASE_URL}/controle/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sistema: 'iluminacao', ligar: newValue }),
      });

      if (!response.ok) throw new Error('Erro ao acionar luzes');
      setToast({ message: `Luzes ${newValue ? 'acesas' : 'apagadas'}!`, type: 'success' });

    } catch (error) {
      setToast({ message: 'Falha ao controlar luzes.', type: 'error' });
      setControls(prev => prev ? ({ ...prev, lightsOn: !newValue }) : null);
    }
  };

  const handleManualIrrigation = async () => {
    if (isIrrigating || !controls) return;
    setIsIrrigating(true);
    setToast(null);

    try {
      const response = await fetch(`${API_BASE_URL}/controle/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sistema: 'irrigacao', ligar: true }),
      });

      if (!response.ok) throw new Error('Falha ao irrigar');
      setToast({ message: 'Sistema de irrigação acionado!', type: 'success' });

      setTimeout(async () => {
        setIsIrrigating(false);
        try {
          await fetch(`${API_BASE_URL}/controle/manual`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sistema: 'irrigacao', ligar: false }),
          });
        } catch (e) {
          console.error("Erro ao desligar irrigação:", e);
        }
      }, 3000);

    } catch (error) {
      setToast({ message: 'Falha ao acionar irrigação.', type: 'error' });
      setIsIrrigating(false);
    }
  };

  if (!controls) {
    return <div className="loading-container">Carregando controles da estufa...</div>;
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
          
          {!controls.isAutoIrrigationOn && (
            <div className="control-item-vertical">
              <label htmlFor="irrigation-interval">Intervalo de Irrigação (horas)</label>
              <input 
                id="irrigation-interval" 
                type="number" 
                className="control-input" 
                value={controls.irrigationInterval} 
                onChange={(e) => handleStateChange('irrigationInterval', Number(e.target.value))} 
              />
            </div>
          )}
        </div>
        <div className="control-card">
          <h2>Controles Manuais</h2>
          <p className="manual-control-description">As ações manuais só são permitidas quando a automação correspondente está desligada.</p>
          <div className="manual-controls-wrapper">
            <button className={`icon-button ${isIrrigating ? 'irrigating' : ''}`} onClick={handleManualIrrigation} disabled={controls.isAutoIrrigationOn || isIrrigating} title="Irrigar Agora">
              <IoWater size={28} />
            </button>
            <button className="icon-button" onClick={toggleLights} disabled={controls.isAutoLightingOn} title={controls.lightsOn ? 'Apagar Luzes' : 'Acender Luzes'}>
              {controls.lightsOn ? <IoBulb size={28} className="light-on-icon" /> : <IoBulbOutline size={28} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;