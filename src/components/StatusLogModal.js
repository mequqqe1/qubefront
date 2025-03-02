import React, { useState, useEffect } from 'react';
import './StatusLogModal.css';

const StatusLogModal = ({ task, onClose, token }) => {
  const [statusLogs, setStatusLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);

  useEffect(() => {
    const fetchStatusLogs = async () => {
      if (!token) {
        setErrorLogs('Токен не найден.');
        return;
      }
      setLoadingLogs(true);
      try {
        const response = await fetch(`https://localhost:7073/api/Account/tasks/${task.id}/status-logs`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Ошибка при загрузке логов статусов');
        const data = await response.json();
        setStatusLogs(data);
      } catch (err) {
        setErrorLogs(err.message);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchStatusLogs();
  }, [task, token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'новый': return 'new';
      case 'требует уточнения': return 'pending';
      case 'в работе': return 'in-progress';
      case 'нуждается': return 'needs';
      case 'выдан': return 'completed';
      case 'выдано без ремонта': return 'no-repair';
      case 'готово': return 'ready';
      default: return 'default';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>История статусов</h2>
        <div className="status-logs-section">
          {loadingLogs ? (
            <div className="loading">Загрузка...</div>
          ) : errorLogs ? (
            <div className="error">{errorLogs}</div>
          ) : statusLogs.length > 0 ? (
            <table className="status-table">
              <thead>
                <tr>
                  <th>Статус</th>
                  <th>Дата изменения</th>
                </tr>
              </thead>
              <tbody>
                {statusLogs.map((log) => (
                  <tr key={log.id}>
                    <td><span className={`status-log ${getStatusColor(log.status)}`}>{log.status}</span></td>
                    <td>{new Date(log.changedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Нет истории статусов</div>
          )}
        </div>
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default StatusLogModal;