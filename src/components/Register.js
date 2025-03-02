import React, { useState } from 'react';

const Register = () => {
  const [iin, setIin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить логику отправки данных на бэкенд
    alert(`Регистрация: IIN=${iin}, Password=${password}`);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Регистрация в AlloMaster</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={iin}
          onChange={(e) => setIin(e.target.value)}
          placeholder="IIN"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#6b48ff', color: 'white', border: 'none' }}>
          Зарегистрироваться
        </button>
      </form>
      <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
    </div>
  );
};

export default Register;