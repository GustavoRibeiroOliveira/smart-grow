import React from 'react';
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

const DashboardPage: React.FC = () => {
  const humidityData = {
    labels: ['01h', '03h', '05h', '07h', '09h', '11h', '13h'],
    datasets: [
      {
        label: 'Umidade do Solo (%)',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(151, 188, 98, 0.4)',
        borderColor: '#97BC62',
        tension: 0.3,
      },
    ],
  };

  const temperatureData = {
    labels: ['01h', '03h', '05h', '07h', '09h', '11h', '13h'],
    datasets: [
      {
        label: 'Temperatura Ambiente (°C)',
        data: [22, 23, 22.5, 24, 25, 24.8, 23.5],
        fill: false,
        backgroundColor: 'rgba(44, 95, 45, 0.4)',
        borderColor: '#2C5F2D',
        tension: 0.3,
      },
    ],
  };

  const lightIntensityData = {
    labels: ['Manhã', 'Tarde', 'Noite'],
    datasets: [
      {
        label: 'Intensidade de Luz (Lux)',
        data: [8000, 12000, 3000],
        backgroundColor: ['#97BC62', '#2C5F2D', 'rgba(44, 95, 45, 0.6)'],
      },
    ],
  };

  const phData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Nível de pH do Solo',
        data: [6.2, 6.3, 6.0, 6.1, 6.5, 6.4, 6.2],
        fill: false,
        backgroundColor: 'rgba(151, 188, 98, 0.6)',
        borderColor: '#97BC62',
        tension: 0.4,
      },
    ],
  };

  const waterLevelData = {
    labels: ['Tanque A', 'Tanque B'],
    datasets: [
      {
        label: 'Nível de Água (%)',
        data: [75, 50],
        backgroundColor: ['#2C5F2D', '#97BC62'],
      },
    ],
  };

  const co2Data = {
    labels: ['08h', '12h', '16h', '20h', '00h'],
    datasets: [
      {
        label: 'Nível de CO2 (ppm)',
        data: [400, 450, 420, 380, 390],
        fill: true,
        backgroundColor: 'rgba(44, 95, 45, 0.3)',
        borderColor: '#2C5F2D',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: '#333333'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
        x: {
            ticks: {
                color: '#333333'
            },
            grid: {
                color: 'rgba(0,0,0,0.05)'
            }
        },
        y: {
            ticks: {
                color: '#333333'
            },
            grid: {
                color: 'rgba(0,0,0,0.05)'
            }
        }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Monitoramento</h1>
        <p>Visão geral em tempo real do seu cultivo indoor.</p>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h2>Umidade do Solo</h2>
          <Line data={humidityData} options={options} />
        </div>

        <div className="chart-card">
          <h2>Temperatura Ambiente</h2>
          <Line data={temperatureData} options={options} />
        </div>

        <div className="chart-card">
          <h2>Intensidade de Luz</h2>
          <Bar data={lightIntensityData} options={options} />
        </div>

        <div className="chart-card">
          <h2>Nível de pH do Solo</h2>
          <Line data={phData} options={options} />
        </div>

        <div className="chart-card">
          <h2>Nível de Água</h2>
          <Bar data={waterLevelData} options={options} />
        </div>

        <div className="chart-card">
          <h2>Nível de CO2</h2>
          <Line data={co2Data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;