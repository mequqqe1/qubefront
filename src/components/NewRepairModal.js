import React, { useState, useEffect } from 'react';
import './NewRepairModal.css';
import ClientSelectionModal from './ClientSelectionModal';

const NewRepairModal = ({ onClose, token, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    date: '',
    phoneNumber: '',
    device: '',
    repairType: '',
    masterId: '',
    amount: '',
    prepayment: '',
    statusId: '',
    note: '',
    staffNote: '',
    reason: '',
    completeness: false,
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.id,
      phoneNumber: client.phoneNumber || '',
    }));
    setIsClientModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7073/api/Account/tasks/create', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clientId: parseInt(formData.clientId) || 0,
          masterId: parseInt(formData.masterId) || 0,
          amount: parseInt(formData.amount) || 0,
          prepayment: parseInt(formData.prepayment) || 0,
          statusId: parseInt(formData.statusId) || 1,
          date: formData.date || new Date().toISOString().split('T')[0],
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании задачи');
      }
      const newTask = await response.json();
      onTaskCreated(newTask);
      onClose();
      alert('Задача успешно создана!');
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handlePrint = () => {
    alert('Функция печати не реализована');
  };

  return (
    <div>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Квитанция N'00000 ?</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Дата</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Клиент</label>
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId || ''}
                  readOnly
                />
                <button
                  type="button"
                  className="select-client-button"
                  onClick={() => setIsClientModalOpen(true)}
                >
                  Выбрать клиента
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Клиент</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Устройство</label>
                <input
                  type="text"
                  name="device"
                  value={formData.device}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Тип ремонта</label>
                <input
                  type="text"
                  name="repairType"
                  value={formData.repairType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Мастер</label>
                <input
                  type="text"
                  name="masterId"
                  value={formData.masterId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Сумма</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Предоплата</label>
                <input
                  type="number"
                  name="prepayment"
                  value={formData.prepayment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Статус</label>
                <input
                  type="text"
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Примечание</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Примечание сотрудника</label>
              <textarea
                name="staffNote"
                value={formData.staffNote}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Причина</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="completeness"
                  checked={formData.completeness}
                  onChange={handleChange}
                />{' '}
                Завершено
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="print-button" onClick={handlePrint}>
                <span className="icon">🖨️</span> Печать
              </button>
              <button type="submit" className="create-button">Создать</button>
              <button type="button" className="cancel-button" onClick={onClose}>Отмена</button>
            </div>
          </form>
        </div>
      </div>

      {isClientModalOpen && (
        <ClientSelectionModal
          onClose={() => setIsClientModalOpen(false)}
          onClientSelect={handleClientSelect}
          token={token}
        />
      )}
    </div>
  );
};

export default NewRepairModal;