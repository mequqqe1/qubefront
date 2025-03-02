import React, { useState } from 'react';
import './Header.css';
import { FaBell, FaUser } from 'react-icons/fa'; // Добавили FaUser для иконки профиля
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Закрытие меню при клике вне области
  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-profile')) {
      setIsProfileOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile'); // Переход на страницу профиля
    setIsProfileOpen(false); // Закрытие меню
  };

  const handleLogout = () => {
    setIsProfileOpen(false); // Закрытие меню
    navigate('/login'); // Выход и переход на страницу логина
  };

  return (
    <div className="header">
      <div className="header-left">
        <nav className="header-nav">
          <a href="#finances" className="nav-link active">Финансы</a>
          <a href="#active" className="nav-link">Active</a>
          <a href="#links" className="nav-link">Links</a>
          <a href="#links" className="nav-link">Links</a>
        </nav>
      </div>
      <div className="header-stats">
        <div className="stat-card">
          <span>Доходы</span>
          <strong>$54.82</strong>
        </div>
        <div className="stat-card">
          <span>Расходы</span>
          <strong>€54.82</strong>
        </div>
        <div className="stat-card">
          <span>Прибыль</span>
          <strong>-804 450</strong>
        </div>
        <div className="stat-card">
          <span>Мои продажи</span>
          <strong>122 982</strong>
        </div>
        <div className="stat-card">
          <span>Касса наличные</span>
          <strong>+131 983</strong>
        </div>
        <div className="stat-card">
          <span>Касса безнал</span>
          <strong>-237 893</strong>
        </div>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          <FaBell />
        </button>
        <div className="user-profile" onClick={toggleProfile}>
          <img src="https://via.placeholder.com/30" alt="User Profile" className="profile-img" />
          {isProfileOpen && (
            <div className="profile-dropdown">
              <ul>
                <li onClick={handleProfileClick}>
                  <FaUser className="dropdown-icon" /> Профиль
                </li>
                <li>Настройки</li>
                <li onClick={handleLogout}>Выход</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;