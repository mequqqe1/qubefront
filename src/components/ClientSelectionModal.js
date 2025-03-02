import React, { useState, useEffect } from 'react';
import './ClientSelectionModal.css';

const ClientSelectionModal = ({ onClose, onClientSelect, token }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

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

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleConfirm = () => {
    if (selectedClient) {
      onClientSelect(selectedClient);
      onClose();
    } else {
      alert('Пожалуйста, выберите клиента.');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Справочник контрагентов</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="clients-table">
          <table>
            <thead>
              <tr>
                <th>Контрагент</th>
                <th>EMAIL</th>
                <th>ТЕЛЕФОН</th>
                <th>АДРЕС</th>
                <th>ТИП ДЕНЬ</th>
                <th>СКАН</th>
                <th>БАЛАНС</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={selectedClient?.id === client.id ? 'selected' : ''}
                >
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phoneNumber}</td>
                  <td>{client.address}</td>
                  <td>{/* Тип день (можно добавить логику) */}</td>
                  <td>{/* Скан (можно добавить иконку) */}</td>
                  <td>{/* Баланс (можно добавить логику) */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-actions">
          <button className="other-button">Очистить →</button>
          <button className="confirm-button" onClick={handleConfirm}>OK</button>
          <button className="cancel-button" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ClientSelectionModal;