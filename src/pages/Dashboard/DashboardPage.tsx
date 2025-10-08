import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaSyncAlt } from 'react-icons/fa';
import './DashboardPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const staticData = {
  humidity: {
    labels: ['01h', '03h', '05h', '07h', '09h', '11h', '13h'],
    values: [65, 59, 80, 81, 56, 55, 40],
  },
  temperature: {
    labels: ['01h', '03h', '05h', '07h', '09h', '11h', '13h'],
    values: [22, 23, 22.5, 24, 25, 24.8, 23.5],
  },
  light: {
    labels: ['Manhã', 'Tarde', 'Noite'],
    values: [8000, 12000, 3000],
  },
};

const DashboardPage: React.FC = () => {
  const [chartData, setChartData] = useState(staticData);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.example.com/smartgrow-data');
      if (!response.ok) throw new Error('Falha na resposta da rede');
      const apiData = await response.json();
      setChartData(apiData);
    } catch (error) {
      console.error("Falha ao buscar dados da API, usando dados estáticos.", error);
      setChartData(staticData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const humidityChart = {
    labels: chartData.humidity.labels,
    datasets: [{
      label: 'Umidade do Solo (%)',
      data: chartData.humidity.values,
      fill: true,
      backgroundColor: 'rgba(151, 188, 98, 0.4)',
      borderColor: '#97BC62',
      tension: 0.3,
    }],
  };

  const temperatureChart = {
    labels: chartData.temperature.labels,
    datasets: [{
      label: 'Temperatura Ambiente (°C)',
      data: chartData.temperature.values,
      fill: false,
      borderColor: '#2C5F2D',
      tension: 0.3,
    }],
  };

  const lightIntensityChart = {
    labels: chartData.light.labels,
    datasets: [{
      label: 'Intensidade de Luz (Lux)',
      data: chartData.light.values,
      backgroundColor: ['#97BC62', '#2C5F2D', 'rgba(44, 95, 45, 0.6)'],
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Monitoramento</h1>
        <p>Visão geral em tempo real do seu cultivo indoor.</p>
        <button onClick={fetchData} className="refresh-icon-button" disabled={loading}>
          <FaSyncAlt className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h2>Umidade do Solo</h2>
          <Line data={humidityChart} options={options} />
        </div>

        <div className="chart-card">
          <h2>Temperatura Ambiente</h2>
          <Line data={temperatureChart} options={options} />
        </div>

        <div className="chart-card">
          <h2>Intensidade de Luz</h2>
          <Bar data={lightIntensityChart} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;