import React, { useState, useEffect } from 'react';
import './ProductTreeModal.css';

const ProductTreeModal = ({ onClose, token }) => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState({});
  const [products, setProducts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Токен не найден. Пожалуйста, войдите заново.');
        setLoading(false);
        return;
      }

      try {
        // Получаем категории
        const categoriesResponse = await fetch('https://localhost:7073/api/Account/categories', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!categoriesResponse.ok) throw new Error('Ошибка при загрузке категорий');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Предварительная загрузка групп для всех категорий
        const groupsData = {};
        for (const category of categoriesData) {
          const groupsResponse = await fetch(`https://localhost:7073/api/Account/groups/category/${category.id}`, {
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (groupsResponse.ok) {
            groupsData[category.id] = await groupsResponse.json();
          } else {
            console.warn(`Категория ${category.id} не имеет групп: ${groupsResponse.statusText}`);
            groupsData[category.id] = [];
          }
        }
        setGroups(groupsData);

        // Предварительная загрузка товаров для всех групп
        const productsData = {};
        for (const categoryId in groupsData) {
          for (const group of groupsData[categoryId]) {
            if (group && group.id) {
              const productsResponse = await fetch(`https://localhost:7073/api/Account/products/group/${group.id}`, {
                headers: {
                  'accept': '*/*',
                  'Authorization': `Bearer ${token}`,
                },
              });
              if (productsResponse.ok) {
                productsData[group.id] = await productsResponse.json();
              } else {
                console.warn(`Группа ${group.id} не имеет товаров: ${productsResponse.statusText}`);
                productsData[group.id] = [];
              }
            }
          }
        }
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Справочник товаров</h2>
        <div className="tree-container">
          <ul className="tree">
            {categories.map((category) => (
              <li key={category.id}>
                <span className="category" onClick={() => toggleCategory(category.id)}>
                  {category.name} {expandedCategories[category.id] ? '[-]' : '[+]'}
                </span>
                {expandedCategories[category.id] && groups[category.id] && groups[category.id].length > 0 && (
                  <ul>
                    {groups[category.id].map((group) => (
                      <li key={group.id}>
                        <span className="group" onClick={() => toggleGroup(group.id)}>
                          {group.name} {expandedGroups[group.id] ? '[-]' : '[+]'}
                        </span>
                        {expandedGroups[group.id] && products[group.id] && products[group.id].length > 0 && (
                          <ul>
                            {products[group.id].map((product) => (
                              <li key={product.id} className="product">
                                {product.name} (Код: {product.code}, Остаток: {product.stock}, Цена: {product.retailPrice})
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-actions">
          <button className="add-button" onClick={() => alert('Функция добавления не реализована')}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTreeModal;