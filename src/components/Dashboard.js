import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Финансы на 22.05.23</h1>
      </div>
      <div className="dashboard-content">
        <div className="finance-cards">
          <div className="finance-card">
            <h3>Доходы</h3>
            <p>+131 983</p>
          </div>
          <div className="finance-card">
            <h3>Расходы</h3>
            <p>-489 396</p>
          </div>
          <div className="finance-card">
            <h3>Прибыль</h3>
            <p>-357 413</p>
          </div>
        </div>
        <div className="placeholder-section">
          <p>Статистика (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;