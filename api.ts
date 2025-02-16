import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/items';

export interface BaseItem {
  id?: number;
  name: string;
  description: string;
  location: string;
  type: 'Недвижимость' | 'Авто' | 'Услуги';
  image: string; // Убираем "?" для обязательного поля
}

export interface RealEstateItem extends BaseItem {
  type: 'Недвижимость';
  propertyType: string;
  area: number;
  rooms: number;
  price: number;
}

export interface AutoItem extends BaseItem {
  type: 'Авто';
  brand: string;
  model: string;
  year: number;
  mileage?: number;
}

export interface ServiceItem extends BaseItem {
  type: 'Услуги';
  serviceType: string;
  experience: number;
  cost: number;
  workSchedule?: string;
}

export type Item = RealEstateItem | AutoItem | ServiceItem;

// Устанавливаем изображение по умолчанию, если его нет
const setDefaultImage = (item: Item): Item => {
  if (!item.image) {
    item.image = 'http://localhost:3000/images/fon.png'; // Заглушка, если изображения нет
  }
  return item;
};

// Получение всех объявлений
export const fetchItems = async () => {
  const response = await axios.get<Item[]>(API_URL);
  return response.data.map(setDefaultImage);
};

// Получение объявления по ID
export const fetchItemById = async (id: number) => {
  const response = await axios.get<Item>(`${API_URL}/${id}`);
  return setDefaultImage(response.data);
};

// Создание объявления
export const createItem = async (item: Item) => {
  const itemWithImage = setDefaultImage(item); // Устанавливаем изображение по умолчанию
  const response = await axios.post<Item>(API_URL, itemWithImage);
  console.log(itemWithImage);
  return response.data;
};

// Обновление объявления
export const updateItem = async (id: number, item: Partial<Item>) => {
  // Объединяем данные с изображением по умолчанию
  const updatedItem = setDefaultImage({ ...item } as Item);
  const response = await axios.put<Item>(`${API_URL}/${id}`, updatedItem);
  return response.data;
};

// Удаление объявления
export const deleteItem = async (
  id: number,
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  console.log('Отправка DELETE-запроса на:', `${API_URL}/${id}`);

  try {
    // Отправка DELETE-запроса
    await axios.delete(`${API_URL}/${id}`);

    // Обновление состояния для удаления элемента из списка
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    console.log(`Объявление с id ${id} удалено.`);
  } catch (error) {
    console.error('Ошибка при удалении:', error);
  }
};
