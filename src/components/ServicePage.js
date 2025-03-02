import React, { useState, useEffect } from 'react';
import './ServicePage.css';
import TaskDetailModal from './TaskDetailModal';

const ServicePage = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        setError('Токен не найден. Пожалуйста, войдите заново.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('https://localhost:7073/api/Account/tasks/company', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Ошибка при загрузке задач');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="service-container">
      <div className="header">
        <div className="controls">
          <button className="control-btn">📄</button>
          <button className="control-btn">📊</button>
          <button className="control-btn">🔍</button>
          <button className="control-btn">⚙️</button>
          <input type="date" className="date-picker" />
          <input type="date" className="date-picker" />
          <input type="text" placeholder="Поиск..." className="search-input" />
        </div>
      </div>
      <div className="table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Ремонт</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Заказчик</th>
              <th>Устройство</th>
              <th>К оплате</th>
              <th>Оплачено</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task.id} onDoubleClick={() => setIsDetailModalOpen(true)}>
                <td>#{task.id}</td>
                <td>{new Date(task.date).toLocaleDateString()}</td>
                <td className={`status ${task.status.toLowerCase()}`}>{task.status}</td>
                <td>{task.client}</td>
                <td>{task.device}</td>
                <td>{task.amount}</td>
                <td>{task.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Назад</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>{i + 1}</button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Вперед</button>
      </div>
      {isDetailModalOpen && (
        <TaskDetailModal task={tasks.find(task => task.id === selectedTaskId)} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

export default ServicePage;
