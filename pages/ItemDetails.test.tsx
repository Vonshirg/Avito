import { render, screen } from '@testing-library/react';
import { ItemDetails } from './ItemDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../api';
import '@testing-library/jest-dom';  // Импортируем jest-dom для matchers

// Мокаем fetchItemById, чтобы тест не зависел от реального API
jest.mock('../api');

test('Кнопки "Редактировать" и "Назад" рендерятся корректно', async () => {
  const mockItem = {
    id: 1,
    name: 'Пример товара',
    description: 'Описание товара',
    location: 'Москва',
    type: 'Недвижимость',
    image: 'https://example.com/image.jpg',
    propertyType: 'Квартира',
    area: 50,
    rooms: 2,
    price: 5000000,
  };

  // Мокаем возвращаемое значение fetchItemById
  (api.fetchItemById as jest.Mock).mockResolvedValue(mockItem);

  render(
    <MemoryRouter initialEntries={['/item/1']}>
      <Routes>
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </MemoryRouter>
  );

  // Ждем, пока кнопки появятся после загрузки данных
  await screen.findByText('Редактировать');
  await screen.findByText('Назад');

  // Проверяем, что кнопки есть в документе
  expect(screen.getByText('Редактировать')).toBeInTheDocument();
  expect(screen.getByText('Назад')).toBeInTheDocument();
});
