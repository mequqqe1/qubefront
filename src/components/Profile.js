import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    companyMail: '',
    companyPhone: '',
    companyAddress: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    surname: '',
    iin: '',
    phoneNumber: '',
    mail: '',
    password: '',
    roleId: 2,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Токен не найден. Пожалуйста, войдите заново.');
        setLoading(false);
        return;
      }

      try {
        const companyResponse = await fetch('https://localhost:7073/api/Account/company/my-company', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!companyResponse.ok) throw new Error('Ошибка при загрузке данных компании');
        const companyData = await companyResponse.json();
        setCompanyData(companyData);
        setEditedData({
          companyMail: companyData.companyMail,
          companyPhone: companyData.companyPhone,
          companyAddress: companyData.companyAddress,
        });

        const employeesResponse = await fetch('https://localhost:7073/api/Account/employees', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!employeesResponse.ok) throw new Error('Ошибка при загрузке данных сотрудников');
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://localhost:7073/api/Account/company/update', {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      if (!response.ok) throw new Error('Ошибка при обновлении данных компании');
      const updatedData = await response.json();
      setCompanyData(updatedData);
      setIsEditing(false);
      alert('Данные успешно обновлены!');
    } catch (err) {
      setError(err.message);
      alert('Ошибка при обновлении данных');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7073/api/Account/register-employee', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEmployee,
          roleId: parseInt(newEmployee.roleId),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при добавлении сотрудника');
      }
      const addedEmployee = await response.json();
      setEmployees((prev) => [...prev, addedEmployee]);
      setNewEmployee({ name: '', surname: '', iin: '', phoneNumber: '', mail: '', password: '', roleId: 2 });
      setIsModalOpen(false);
      alert('Сотрудник успешно добавлен!');
    } catch (err) {
      setError(err.message);
      alert(`Ошибка: ${err.message}`);
    }
  };

  const roleOptions = [
    { id: 2, name: 'Менеджер' },
    { id: 3, name: 'Сотрудник' },
    { id: 4, name: 'Админ' },
  ];

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Список филиалов</h1>
        <div className="header-actions">
          <button className="action-button filter">⋮</button>
        </div>
      </div>
      <div className="profile-content">
        <div className="company-info">
          <div className="avatar">PI</div>
          <div className="company-details">
            <div className="detail-item">
              <label>Компания</label>
              <input type="text" value={companyData?.companyName || ''} readOnly />
            </div>
            <div className="detail-item">
              <label>Телефон</label>
              <input
                type="text"
                name="companyPhone"
                value={isEditing ? editedData.companyPhone : companyData?.companyPhone || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="detail-item">
              <label>Адрес</label>
              <input
                type="text"
                name="companyAddress"
                value={isEditing ? editedData.companyAddress : companyData?.companyAddress || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="detail-item">
              <label>Действующий филиал</label>
              <input type="text" value="Шымкент" readOnly />
            </div>
            <div className="detail-item">
              <label>Штат</label>
              <input type="text" value={employees.length} readOnly />
            </div>
            <div className="detail-item">
              <label>Описание</label>
              <textarea
                name="companyMail"
                value={isEditing ? editedData.companyMail : companyData?.companyMail || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>Сохранить</button>
          ) : (
            <button className="edit-button" onClick={handleEdit}>Редактировать</button>
          )}
        </div>
        <div className="employees-section">
          <div className="employees-header">
            <h2>Список сотрудников</h2>
            <button className="add-employee-button" onClick={() => setIsModalOpen(true)}>Добавить сотрудника</button>
          </div>
          <table className="employees-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Роль</th>
                <th>Филиал</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td><img src="https://via.placeholder.com/30" alt="Employee" className="employee-photo" /></td>
                  <td>{employee.name} {employee.surname}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.roleId === 2 ? 'Менеджер' : employee.roleId === 3 ? 'Сотрудник' : 'Админ'}</td>
                  <td>{employee.branchId === 1 ? 'Шымкент' : 'Другой'}</td>
                  <td><button className="action-button edit">✎</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Добавить сотрудника</h2>
            <form onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label>Имя</label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Фамилия</label>
                <input
                  type="text"
                  name="surname"
                  value={newEmployee.surname}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>IIN</label>
                <input
                  type="text"
                  name="iin"
                  value={newEmployee.iin}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={newEmployee.phoneNumber}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="mail"
                  value={newEmployee.mail}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Роль</label>
                <select
                  name="roleId"
                  value={newEmployee.roleId}
                  onChange={handleEmployeeChange}
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">Добавить</button>
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;