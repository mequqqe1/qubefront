import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [iin, setIin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Отправка запроса...', { iin, password });

    try {
      const response = await fetch('https://localhost:7073/api/Account/login', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iin, password }),
      });

      console.log('Ответ от сервера:', response.status, response);
      if (response.ok) {
        const data = await response.json(); // Предполагаем, что бэкенд возвращает токен
        console.log('Данные ответа:', data);
        const token = data.token; // Извлекаем токен (измените поле, если оно другое, например, 'access_token')
        if (token) {
          localStorage.setItem('token', token); // Сохраняем токен в localStorage
          console.log('Токен сохранен:', token);
          onLogin(); // Вызываем функцию авторизации
        } else {
          throw new Error('Токен не получен от сервера');
        }
      } else {
        const errorData = await response.json();
        console.log('Ошибка:', errorData);
        alert(`Ошибка авторизации: ${response.status} - ${errorData.message || 'Проверьте данные'}`);
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      alert('Произошла ошибка при подключении к серверу');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <span role="img" aria-label="AlloMaster Logo">📦</span> AlloMaster
        </div>
        <h2>Добро пожаловать в AlloMaster!</h2>
        <p>Пожалуйста, войдите в свою учетную запись</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={iin}
            onChange={(e) => setIin(e.target.value)}
            placeholder="IIN"
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input-field"
          />
          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
        <p className="register-link">
          Ещё нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
};

export default Login;