import React, { useState, useEffect } from 'react';
import './ServicePage.css';
import TaskDetailModal from './TaskDetailModal';

const ServicePage = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        setError('Токен не найден.');
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

  const fetchStatusLogs = async (taskId) => {
    setLoadingLogs(true);
    setErrorLogs(null);
    console.log('Fetching status logs for taskId:', taskId); // Отладка
    try {
      const response = await fetch(`https://localhost:7073/api/Account/tasks/${taskId}/status-logs`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText} (${response.status})`);
      }
      const data = await response.json();
      console.log('Status logs fetched:', data); // Отладка
      setStatusLogs(data);
    } catch (err) {
      setErrorLogs(err.message);
      console.error('Error fetching status logs:', err); // Отладка
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSingleClick = (task) => {
    setSelectedTaskId(task.id);
    fetchStatusLogs(task.id);
  };

  const handleDoubleClick = (task) => {
    setSelectedTaskId(task.id);
    setIsDetailModalOpen(true);
  };

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

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;

  return (
    <div className="service-container">
      <h2>Сервис</h2>
      <div className="content-wrapper">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Ремонт</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Заказчик</th>
              <th>Устройство</th>
              <th>Оплата</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => handleSingleClick(task)}
                onDoubleClick={() => handleDoubleClick(task)}
                className={selectedTaskId === task.id ? 'selected' : ''}
              >
                <td>#{task.id}</td>
                <td>{new Date(task.date).toLocaleDateString()}</td>
                <td><span className={`status ${getStatusColor(task.status)}`}>{task.status || (task.completeness ? 'Завершено' : 'В процессе')}</span></td>
                <td>Клиент {task.clientId}</td>
                <td>{task.device}</td>
                <td>{task.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Назад
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Вперед
          </button>
        </div>
      </div>
      {selectedTaskId && (
        <div className="status-panel">
          <h3>История статусов</h3>
          {loadingLogs ? (
            <div className="loading">Загрузка...</div>
          ) : errorLogs ? (
            <div className="error">Ошибка: {errorLogs}</div>
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
      )}
      {isDetailModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setIsDetailModalOpen(false)}
          token={token}
        />
      )}
    </div>
  );
};

export default ServicePage;