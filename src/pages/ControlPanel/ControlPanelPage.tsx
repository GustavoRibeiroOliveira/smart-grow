import React, { useState, useEffect } from 'react';
import { IoBulbOutline, IoBulb, IoWater } from 'react-icons/io5';
import './ControlPanelPage.css';

interface ControlState {
  isAutoIrrigationOn: boolean;
  isAutoLightingOn: boolean;
  irrigationInterval: number;
  lightsOn: boolean;
}

const staticControlState: ControlState = {
  isAutoIrrigationOn: true,
  isAutoLightingOn: true,
  irrigationInterval: 24,
  lightsOn: false,
};

const ControlPanelPage: React.FC = () => {
  const [controls, setControls] = useState<ControlState>(staticControlState);

  useEffect(() => {
    const fetchControlState = async () => {
      try {
        const response = await fetch('https://api.example.com/control-panel-state');
        if (!response.ok) throw new Error('Falha na resposta da rede');
        const apiData = await response.json();
        setControls(apiData);
      } catch (error) {
        console.error("Falha ao buscar estado dos controles, usando dados estáticos.", error);
        setControls(staticControlState);
      }
    };
    fetchControlState();
  }, []);

  const handleToggle = (key: keyof ControlState) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControls(prev => ({ ...prev, irrigationInterval: Number(e.target.value) }));
  };

  const handleManualIrrigation = () => {
    alert('Sistema de irrigação acionado manualmente!');
  };

  return (
    <div className="control-panel-container">
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
              <input
                id="auto-irrigation"
                type="checkbox"
                checked={controls.isAutoIrrigationOn}
                onChange={() => handleToggle('isAutoIrrigationOn')}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="control-item">
            <label htmlFor="auto-lighting">Iluminação Automática</label>
            <label className="switch">
              <input
                id="auto-lighting"
                type="checkbox"
                checked={controls.isAutoLightingOn}
                onChange={() => handleToggle('isAutoLightingOn')}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="control-item-vertical">
            <label htmlFor="irrigation-interval">Intervalo de Irrigação (horas)</label>
            <input
              id="irrigation-interval"
              type="number"
              className="control-input"
              value={controls.irrigationInterval}
              onChange={handleIntervalChange}
              disabled={controls.isAutoIrrigationOn}
            />
          </div>
        </div>

        <div className="control-card">
          <h2>Controles Manuais</h2>
          <p className="manual-control-description">As ações manuais só são permitidas quando a automação correspondente está desligada.</p>
          <div className="manual-controls-wrapper">
            <button
              className="icon-button"
              onClick={handleManualIrrigation}
              disabled={controls.isAutoIrrigationOn}
              title="Irrigar Agora"
            >
              <IoWater size={28} />
            </button>
            <button
              className="icon-button"
              onClick={() => handleToggle('lightsOn')}
              disabled={controls.isAutoLightingOn}
              title={controls.lightsOn ? 'Apagar Luzes' : 'Acender Luzes'}
            >
              {controls.lightsOn ? <IoBulb size={28} className="light-on-icon" /> : <IoBulbOutline size={28} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;