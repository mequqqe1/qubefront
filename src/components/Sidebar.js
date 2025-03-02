import React from 'react';
import './Sidebar.css';
import { FaUser, FaBell, FaWarehouse, FaCog, FaChartBar, FaMoneyBillWave, FaClipboardList, FaShoppingCart, FaTools, FaBriefcase, FaDatabase } from 'react-icons/fa';

const Sidebar = ({ onNewRepairClick, onProductsClick, onSaleClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">AM</div> AlloMaster
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item active">
          <FaUser className="menu-icon" /> Добавить
          <ul className="submenu">
            <li onClick={onNewRepairClick}>Новый ремонт</li>
            <li onClick={onSaleClick}>Новая продажа</li>
            <li>Новая задача</li>
            <li>Новая запись</li>
          </ul>
        </li>
        <li className="menu-item">
          <FaBell className="menu-icon" /> Уведомления
          <ul className="submenu">
            <li>Сервис <span className="badge">2</span></li>
            <li>Магазин <span className="badge">5</span></li>
            <li>Задачи <span className="badge">3</span></li>
            <li>Очереди <span className="badge">1</span></li>
          </ul>
        </li>
        <li className="menu-item">
          <FaWarehouse className="menu-icon" /> Склад
          <ul className="submenu">
            <li>Склады</li>
            <li>Клиенты</li>
            <li>Устройства</li>
            <li>Товары</li>
            <li>Услуги</li>
          </ul>
        </li>
        <li className="menu-item" onClick={onProductsClick}>
          <FaShoppingCart className="menu-icon" /> Товары
        </li>
        <li className="menu-item">
          <FaTools className="menu-icon" /> Сервис
        </li>
        <li className="menu-item">
          <FaCog className="menu-icon" /> Должники
        </li>
        <li className="menu-item">
          <FaChartBar className="menu-icon" /> Кредиторы
        </li>
        <li className="menu-item">
          <FaMoneyBillWave className="menu-icon" /> Движение товара
        </li>
        <li className="menu-item">
          <FaClipboardList className="menu-icon" /> Расход товара
        </li>
        <li className="menu-item">
          <FaBriefcase className="menu-icon" /> По сотрудникам
        </li>
        <li className="menu-item">
          <FaCog className="menu-icon" /> Настройки
        </li>
        <li className="menu-item">
          <FaDatabase className="menu-icon" /> SQL Commands
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;