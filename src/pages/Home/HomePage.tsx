import React from 'react';
import './HomePage.css';
import heroImage from '../../assets/hero-image.jpg';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <header 
        className="hero-section" 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>SmartGrow</h1>
          <h2>Tecnologia e Natureza em Perfeita Harmonia</h2>
        </div>
      </header>

      <main className="project-description">
        <div className="container">
          <h2>O Projeto</h2>
          <p>
            O <strong>SmartGrow</strong> é um sistema de automação completo projetado para otimizar o cultivo de plantas em ambientes internos. Utilizando uma rede de sensores inteligentes e atuadores, nossa plataforma monitora e controla variáveis cruciais como umidade, temperatura, intensidade de luz e irrigação, garantindo as condições ideais para um crescimento saudável e eficiente.
          </p>
          
          <h3>Principais Funcionalidades</h3>
          <ul className="features-list">
            <li>
              <strong>Monitoramento em Tempo Real:</strong> Acompanhe todos os dados vitais do seu cultivo através de um dashboard intuitivo.
            </li>
            <li>
              <strong>Controle Automatizado:</strong> Configure regras para que o sistema ajuste automaticamente a iluminação, a ventilação e a irrigação.
            </li>
            <li>
              <strong>Análise de Dados Históricos:</strong> Analise o desempenho passado para otimizar ciclos de cultivo futuros e aumentar a produtividade.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;