import React, { useState, useEffect } from "react";
import { fetchItems, deleteItem, Item } from "../api";
import { useNavigate } from "react-router-dom";
import "./style/styles.css";

const categoryFilters: Record<string, string[]> = {
  Недвижимость: ["price", "area", "rooms"],
  Авто: ["brand", "year", "mileage"],
  Услуги: ["serviceType", "cost"],
};

function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [extraFilters, setExtraFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [modalItem, setModalItem] = useState<Item | null>(null); // Состояние для модального окна
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems().then((fetchedItems) => {
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    });
  }, []);

  const handleDelete = (id: number) => {
    deleteItem(id, setItems);
  };

  const handleFilter = () => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category) {
      filtered = filtered.filter((item) => item.type === category);
    }

    Object.entries(extraFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          if (key in item) {
            return item[key as keyof Item]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
          }
          return true;
        });
      }
    });

    setFilteredItems(filtered);
    setPage(1); // Сброс страницы на 1 при изменении фильтров
  };

  useEffect(() => {
    handleFilter();
  }, [search, category, extraFilters, items]);

  const handleExtraFilterChange = (field: string, value: string) => {
    setExtraFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCardClick = (item: Item) => {
    setModalItem(item); // Открыть модальное окно с выбранным товаром
  };

  const closeModal = () => {
    setModalItem(null); // Закрыть модальное окно
  };

  return (
    <div className="itemList">
      <div className="searchAndFilters">
        <div className="searchContainer">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1); // Сброс страницы на 1 при изменении категории
            }}
            className="filterSelect"
          >
            <option value="">Все категории</option>
            <option value="Недвижимость">Недвижимость</option>
            <option value="Авто">Авто</option>
            <option value="Услуги">Услуги</option>
          </select>

          <input
            type="text"
            placeholder="Поиск..."
            className="searchBar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Сброс страницы на 1 при изменении поиска
            }}
          />
        </div>
        <button className="addButton" onClick={() => navigate("/form")}>
          Разместить объявление
        </button>
      </div>

      {category && categoryFilters[category] && (
        <div className="extraFilters">
          {categoryFilters[category].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={`Фильтр по ${field}`}
              className="extraFilterInput"
              value={extraFilters[field] || ""}
              onChange={(e) => {
                handleExtraFilterChange(field, e.target.value);
                setPage(1); // Сброс страницы на 1 при изменении дополнительного фильтра
              }}
            />
          ))}
        </div>
      )}

      <ul className="list">
        {paginatedItems.map((item) => (
          <li
            key={item.id}
            className="listItem"
            onClick={() => handleCardClick(item)}
          >
            <button
              className="deleteButton"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(item.id!);
              }}
            >
              &times;
            </button>
            <img
              src={item.image || "/placeholder.jpg"}
              alt="item"
              className="listItemImage"
            />
            <div className="listItemDetails">
              <h3 className="listItemTitle">{item.name}</h3>
              <p>
                {item.location} - {item.type}
              </p>
              <div className="listItemButtons">
                <button onClick={() => navigate(`/form/${item.id}`)}>
                  Редактировать
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="paginationButtons">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="paginationButton"
          >
            Назад
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="paginationButton"
          >
            Вперёд
          </button>
        </div>
      )}

      {modalItem && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal_list" onClick={(e) => e.stopPropagation()}>
            <h2>{modalItem.name}</h2>
            <p>{modalItem.description}</p>
            <p>
              {modalItem.location} - {modalItem.type}
            </p>

            {modalItem.image && (
              <div>
                <img
                  src={modalItem.image}
                  alt={modalItem.name}
                  style={{ width: "400px", height: "auto" }}
                />
              </div>
            )}

            {modalItem.type === "Недвижимость" && (
              <>
                <p>Тип недвижимости: {modalItem.propertyType}</p>
                <p>Площадь: {modalItem.area} м²</p>
                <p>Комнаты: {modalItem.rooms}</p>
                <p>Цена: {modalItem.price} ₽</p>
              </>
            )}

            {modalItem.type === "Авто" && (
              <>
                <p>Бренд: {modalItem.brand}</p>
                <p>Модель: {modalItem.model}</p>
                <p>Год выпуска: {modalItem.year}</p>
                {modalItem.mileage && <p>Пробег: {modalItem.mileage} км</p>}
              </>
            )}

            {modalItem.type === "Услуги" && (
              <>
                <p>Тип услуги: {modalItem.serviceType}</p>
                <p>Опыт: {modalItem.experience} лет</p>
                <p>Стоимость: {modalItem.cost} ₽</p>
                {modalItem.workSchedule && (
                  <p>График работы: {modalItem.workSchedule}</p>
                )}
              </>
            )}
            <button onClick={() => navigate(`/form/${modalItem.id}`)}>
              Редактировать
            </button>
            <button className="closeButton" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemList;
