import React, { useState, useEffect } from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose, token }) => {
  const [formData, setFormData] = useState({
    id: task.id,
    date: task.date,
    device: task.device,
    clientPhone: '', // Поле для телефона клиента
    completeness: task.completeness,
    note: task.note,
    staffNote: task.staffNote,
    reason: task.reason,
    repairType: task.repairType,
    amount: task.amount,
    prepayment: task.prepayment,
    status: task.status || '',
  });
  const [statusLogs, setStatusLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);

  useEffect(() => {
    setFormData({
      id: task.id,
      date: task.date,
      device: task.device,
      clientPhone: '', // Загрузка телефона клиента через ClientId, если нужно
      completeness: task.completeness,
      note: task.note,
      staffNote: task.staffNote,
      reason: task.reason,
      repairType: task.repairType,
      amount: task.amount,
      prepayment: task.prepayment,
      status: task.status || '',
    });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://localhost:7073/api/Account/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: formData.status }),
      });
      if (!response.ok) throw new Error('Ошибка при сохранении статуса');
      const updatedTask = await response.json();
      setFormData((prev) => ({ ...prev, status: updatedTask.status }));
      onClose();
      alert('Статус успешно обновлен!');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Карта ремонта устройства в сервисе</h2>
        <div className="task-details">
          <div className="detail-row">
            <label>Ремонт #</label>
            <input type="text" value={formData.id} readOnly />
          </div>
          <div className="detail-row">
            <label>Дата приема</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Клиент</label>
            <input type="text" name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="Телефон клиента" />
          </div>
          <div className="detail-row">
            <label>Телефон</label>
            <input type="text" value={`+7 ${formData.clientPhone}`} readOnly />
          </div>
          <div className="detail-row">
            <label>Устройство</label>
            <input type="text" name="device" value={formData.device} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Тип ремонта</label>
            <input type="text" name="repairType" value={formData.repairType} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Примечание</label>
            <textarea name="note" value={formData.note} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Примечание менеджера</label>
            <textarea name="staffNote" value={formData.staffNote} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Статус</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Причина</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Сумма</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
          </div>
          <div className="detail-row">
            <label>Предоплата</label>
            <input type="number" name="prepayment" value={formData.prepayment} onChange={handleChange} />
          </div>
        </div>
        <div className="status-logs-section">
          <h3>История статусов</h3>
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
          <button className="comment-button">Добавить</button>
          <button className="save-button" onClick={handleSave}>Сохранить</button>
          <button className="close-button" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );

  // Функция для определения цвета статуса
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
};

export default TaskDetailModal;