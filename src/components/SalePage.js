import React, { useState } from 'react';
import './SalePage.css';
import ClientSelectionModal from './ClientSelectionModal';
import ProductCatalog from './ProductCatalog';

const SalePage = ({ token }) => {
  const [clientId, setClientId] = useState('');
  const [saleItems, setSaleItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [priceTypeId, setPriceTypeId] = useState(1);
  const [message, setMessage] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleClientSelect = (client) => {
    setClientId(client.id);
  };

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0 && unitPrice) {
      const newItem = {
        productId: selectedProduct.id,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        priceTypeId: parseInt(priceTypeId),
        name: selectedProduct.name || 'Неизвестно',
      };
      setSaleItems([...saleItems, newItem]);
      setSelectedProduct(null);
      setQuantity(1);
      setUnitPrice('');
      setIsProductModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setMessage('Пожалуйста, выберите клиента.');
      return;
    }
    try {
      const response = await fetch('https://localhost:7073/api/Sales', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: parseInt(clientId),
          saleItems: saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            priceTypeId: item.priceTypeId,
          })),
        }),
      });
      if (!response.ok) throw new Error(`Ошибка: ${response.statusText} (${response.status})`);
      const data = await response.json();
      setMessage('Продажа успешно создана!');
      setSaleItems([]);
      setClientId('');
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  return (
    <div className="sale-container">
      <h2>Новая продажа</h2>
      <form onSubmit={handleSubmit} className="sale-form">
        <div className="form-group">
          <label>Клиент:</label>
          <input
            type="text"
            value={clientId ? `Клиент ${clientId}` : ''}
            readOnly
            placeholder="Выберите клиента"
          />
          <button type="button" onClick={() => setIsClientModalOpen(true)} className="select-client-button">
            Выбрать клиента
          </button>
        </div>
        <div className="form-group">
          <label>Выбор товара:</label>
          <button type="button" onClick={() => setIsProductModalOpen(true)} className="select-product-button">
            Выбрать товар
          </button>
          {selectedProduct && (
            <div className="product-selection">
              <span>{selectedProduct.name}</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Количество"
                min="1"
              />
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Цена за единицу"
                min="0"
              />
              <select value={priceTypeId} onChange={(e) => setPriceTypeId(e.target.value)}>
                <option value="1">Розничная</option>
                <option value="2">Оптовая</option>
              </select>
              <button type="button" onClick={handleAddProduct} className="add-button">
                Добавить
              </button>
            </div>
          )}
        </div>
        <div className="form-group">
          <h3>Выбранные товары</h3>
          <table className="sale-items-table">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Подитог</th>
              </tr>
            </thead>
            <tbody>
              {saleItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.quantity * item.unitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="submit-button">Создать продажу</button>
        {message && <div className={`message ${message.includes('Ошибка') ? 'error' : ''}`}>{message}</div>}
      </form>
      {isClientModalOpen && (
        <ClientSelectionModal
          token={token}
          onClose={() => setIsClientModalOpen(false)}
          onClientSelect={handleClientSelect}
        />
      )}
      {isProductModalOpen && (
        <ProductCatalog
          token={token}
          onSelectProduct={(product) => {
            setSelectedProduct(product);
            setIsProductModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SalePage;