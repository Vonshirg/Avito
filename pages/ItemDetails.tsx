import React, { useEffect, useState } from "react";
import { fetchItemById } from '../api';
import { Item} from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (id) {
      fetchItemById(Number(id)).then(setItem);
    }
  }, [id]);

  if (!item) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>{item.location} - {item.type}</p>

      {/* Если изображение есть, отображаем его */}
      {item.image && (
        <div>
          <img src={item.image} alt={item.name} style={{ width: '300px', height: 'auto' }} />
        </div>
      )}

      {/* Отображаем дополнительные поля в зависимости от типа */}
      {item.type === "Недвижимость" && (
        <>
          <p>Тип недвижимости: {item.propertyType}</p>
          <p>Площадь: {item.area} м²</p>
          <p>Комнаты: {item.rooms}</p>
          <p>Цена: {item.price} ₽</p>
        </>
      )}

      {item.type === "Авто" && (
        <>
          <p>Бренд: {item.brand}</p>
          <p>Модель: {item.model}</p>
          <p>Год выпуска: {item.year}</p>
          {item.mileage && <p>Пробег: {item.mileage} км</p>}
        </>
      )}

      {item.type === "Услуги" && (
        <>
          <p>Тип услуги: {item.serviceType}</p>
          <p>Опыт: {item.experience} лет</p>
          <p>Стоимость: {item.cost} ₽</p>
          {item.workSchedule && <p>График работы: {item.workSchedule}</p>}
        </>
      )}

      <button onClick={() => navigate(`/form/${id}`)}>Редактировать</button>
      <button onClick={() => navigate('/list')}>Назад</button>
    </div>
  );
}

export default ItemDetails;
