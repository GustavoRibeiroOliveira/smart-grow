import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { FaSyncAlt, FaCalendarAlt } from 'react-icons/fa';
import { format, isSameDay, isSameMonth, min, max, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Toast from '../../components/common/Toast';
import './DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
registerLocale('pt-BR', ptBR);

interface DataPoint { time: Date; humidity: number; temperature: number; light: number; }

const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    for (let j = 0; j < 4; j++) {
      const hour = j * 6;
      const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
      data.push({
        time: timestamp,
        humidity: 60 + Math.random() * 15,
        temperature: 22 + Math.random() * 5,
        light: (hour > 6 && hour < 18) ? 8000 + Math.random() * 4000 : 0,
      });
    }
  }
  return data;
};

const staticData = generateMockData();

const DashboardPage: React.FC = () => {
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterType, setFilterType] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateBoundaries = useMemo(() => {
    if (allData.length === 0) return { minDate: new Date(), maxDate: new Date() };
    const dates = allData.map(d => d.time);
    return {
      minDate: min(dates),
      maxDate: max(dates),
    };
  }, [allData]);

  useEffect(() => {
    if (allData.length > 0) {
      let data;
      if (filterType === 'day') {
        data = allData.filter(d => isSameDay(d.time, selectedDate));
      } else {
        data = allData.filter(d => isSameMonth(d.time, selectedDate));
      }
      setFilteredData(data);
    }
  }, [selectedDate, filterType, allData]);

  const fetchData = async (isManualRefresh = false) => {
    setLoading(true);
    setToast(null);
    try {
      const response = await fetch('https://api.example.com/smartgrow-data-range');
      if (!response.ok) throw new Error('Falha na resposta da rede');
      const apiResult = await response.json();
      const formattedApiData = apiResult.map((d: any) => ({ ...d, time: parseISO(d.time) }));
      setAllData(formattedApiData);
      if (isManualRefresh) setToast({ message: 'Dados atualizados com sucesso!', type: 'success' });
    } catch (error) {
      console.error("Falha ao buscar dados da API, usando dados estáticos.", error);
      setAllData(staticData);
      if (isManualRefresh) setToast({ message: 'Falha no servidor. Usando dados locais.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChartLabels = () => {
    if (filterType === 'day') {
      return filteredData.map(d => format(d.time, 'HH:mm'));
    }
    return [...new Set(filteredData.map(d => format(d.time, 'dd/MM')))];
  };
  
  const getAggregatedData = (key: 'humidity' | 'temperature' | 'light') => {
    if (filterType === 'day') return filteredData.map(d => d[key]);
    const aggregation: { [day: string]: { sum: number, count: number } } = {};
    filteredData.forEach(d => {
      const day = format(d.time, 'dd/MM');
      if (!aggregation[day]) aggregation[day] = { sum: 0, count: 0 };
      aggregation[day].sum += d[key];
      aggregation[day].count++;
    });
    return Object.values(aggregation).map(agg => agg.sum / agg.count);
  };

  const humidityChart = { labels: getChartLabels(), datasets: [{ label: 'Umidade do Solo (%)', data: getAggregatedData('humidity'), fill: true, backgroundColor: 'rgba(151, 188, 98, 0.4)', borderColor: '#97BC62', tension: 0.3 }], };
  const temperatureChart = { labels: getChartLabels(), datasets: [{ label: 'Temperatura Ambiente (°C)', data: getAggregatedData('temperature'), fill: false, borderColor: '#2C5F2D', tension: 0.3 }], };
  const lightIntensityChart = { labels: getChartLabels(), datasets: [{ label: 'Intensidade de Luz (Lux)', data: getAggregatedData('light'), backgroundColor: '#97BC62' }], };
  const options = { responsive: true, plugins: { legend: { position: 'top' as const }, title: { display: false } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.05)' } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } } };

  return (
    <div className="dashboard-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="dashboard-header">
        <h1>Dashboard de Monitoramento</h1>
        <p>Visão geral em tempo real do seu cultivo indoor.</p>
        <button onClick={() => fetchData(true)} className="refresh-icon-button" disabled={loading}>
          <FaSyncAlt className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Agrupar por:</label>
          <button className={`filter-btn ${filterType === 'day' ? 'active' : ''}`} onClick={() => setFilterType('day')}>Dia</button>
          <button className={`filter-btn ${filterType === 'month' ? 'active' : ''}`} onClick={() => setFilterType('month')}>Mês</button>
        </div>
        <div className="filter-group">
          <label>Selecionar:</label>
          <div className="date-input-wrapper">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              minDate={dateBoundaries.minDate}
              maxDate={dateBoundaries.maxDate}
              showMonthYearPicker={filterType === 'month'}
              dateFormat={filterType === 'day' ? 'dd/MM/yyyy' : 'MM/yyyy'}
              locale="pt-BR"
              className="date-input"
            />
            <FaCalendarAlt className="date-input-icon" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Carregando dados...</div>
      ) : (
        <div className="dashboard-flex-grid">
          <div className="chart-card"><h2>Umidade do Solo</h2><Line data={humidityChart} options={options} /></div>
          <div className="chart-card"><h2>Temperatura Ambiente</h2><Line data={temperatureChart} options={options} /></div>
          <div className="chart-card"><h2>Intensidade de Luz</h2><Bar data={lightIntensityChart} options={options} /></div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;