import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ItemDetails from './ItemDetails';
import { fetchItemById } from '../api';

// Типизация mock для fetchItemById
jest.mock('../api', () => ({
  fetchItemById: jest.fn() as jest.MockedFunction<typeof fetchItemById>
}));

// Мокаем useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const mockItem = {
  id: 1,
  name: 'Пример товара',
  description: 'Описание товара',
  location: 'Москва',
  type: 'Недвижимость',
  propertyType: 'Квартира',
  area: 50,
  rooms: 2,
  price: 5000000,
  image: 'https://example.com/image.jpg'
};

describe('ItemDetails', () => {
  test("Отображает сообщение 'Загрузка...' перед загрузкой данных", async () => {
    // Мокаем вызов fetchItemById
    (fetchItemById as jest.Mock).mockResolvedValueOnce(mockItem);

    render(
      <MemoryRouter initialEntries={['/item/1']}>
        <Routes>
          <Route path='/item/:id' element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();
  });

  test('Отображает данные после загрузки', async () => {
    // Мокаем вызов fetchItemById
    (fetchItemById as jest.Mock).mockResolvedValueOnce(mockItem);

    render(
      <MemoryRouter initialEntries={['/item/1']}>
        <Routes>
          <Route path='/item/:id' element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    );
    expect(screen.getByText(mockItem.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockItem.location} - ${mockItem.type}`)
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockItem.name })).toHaveAttribute(
      'src',
      mockItem.image
    );
  });

  test("Кнопки 'Редактировать' и 'Назад' работают", async () => {
    // Мокаем вызов fetchItemById
    (fetchItemById as jest.Mock).mockResolvedValueOnce(mockItem);

    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    render(
      <MemoryRouter initialEntries={['/item/1']}>
        <Routes>
          <Route path='/item/:id' element={<ItemDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(mockItem.name)).toBeInTheDocument()
    );

    await userEvent.click(screen.getByText(/Редактировать/i));
    expect(navigateMock).toHaveBeenCalledWith(`/form/1`);

    await userEvent.click(screen.getByText(/Назад/i));
    expect(navigateMock).toHaveBeenCalledWith(`/list`);
  });
});
