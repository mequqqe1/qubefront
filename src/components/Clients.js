import React, { useState, useEffect } from 'react';
import './Clients.css';

const Clients = ({ onClientSelect }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClients = async () => {
      if (!token) {
        setError('Токен не найден. Пожалуйста, войдите заново.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://localhost:7073/api/Account/clients', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Ошибка при загрузке списка клиентов');
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="clients-container">
      <h2>Список клиентов</h2>
      <ul className="clients-list">
        {clients.map((client) => (
          <li key={client.id} onClick={() => onClientSelect(client)} className="client-item">
            {client.name} (Телефон: {client.phoneNumber}, Email: {client.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;