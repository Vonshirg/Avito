import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { createItem, fetchItemById, updateItem } from "../api";
import { Item } from "../api";
import { propertyTypes, carBrands, serviceTypes} from "../types/aDtypes";
import "./style/styles.css";

Modal.setAppElement("#root");

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Загружаем данные из localStorage
  const savedData = localStorage.getItem("formData");
  const parsedData = savedData ? JSON.parse(savedData) : {};

  const [formData, setFormData] = useState<Partial<Item>>({
    name: "",
    description: "",
    location: "",
    image: "",
    type: "Недвижимость",
    ...parsedData, // Используем сохранённые данные, если есть
  });

  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [errors, setErrors] = useState<{
    name: boolean;
    description: boolean;
    location: boolean;
    image: boolean;
    propertyType?: boolean;
    area?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    rooms?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    price?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    brand?: boolean;
    model?: boolean;
    year?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    mileage?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    serviceType?: boolean;
    experience?: { empty: boolean; notNumber: boolean };
    cost?: { empty: boolean; notNumber: boolean; zeroOrNegative: boolean };
    workSchedule?: boolean;
  }>({
    name: false,
    description: false,
    location: false,
    image: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Загружаем данные из API при редактировании
  useEffect(() => {
    if (id) {
      fetchItemById(Number(id)).then((data) => {
        setFormData((prev) => ({ ...prev, ...data }));
      });
    }
  }, [id]);
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // Пытаемся создать объект URL
      return true; // Если получилось, значит это валидная ссылка
    } catch (e) {
      return false; // Если ошибка, значит это невалидная ссылка
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };

    // Валидация первого шага
    newErrors.name = !formData.name;
    newErrors.description = !formData.description;
    newErrors.location = !formData.location;
    newErrors.image = formData.image && !isValidUrl(formData.image);

    // Валидация второго шага
    if (step === 2) {
      if (formData.type === "Недвижимость") {
        newErrors.propertyType = !formData.propertyType;

        newErrors.area = {
          empty: !formData.area,
          notNumber: isNaN(Number(formData.area)),
          zeroOrNegative: Number(formData.area) <= 0,
        };

        newErrors.rooms = {
          empty: !formData.rooms,
          notNumber: isNaN(Number(formData.rooms)),
          zeroOrNegative: Number(formData.rooms) <= 0,
        };

        newErrors.price = {
          empty: !formData.price,
          notNumber: isNaN(Number(formData.price)),
          zeroOrNegative: Number(formData.price) <= 0,
        };
      } else if (formData.type === "Авто") {
        newErrors.brand = !formData.brand;
        newErrors.model = !formData.model;

        newErrors.year = {
          empty: !formData.year,
          notNumber: isNaN(Number(formData.year)),
          zeroOrNegative: Number(formData.year) <= 1900,
        };
      } else if (formData.type === "Услуги") {
        newErrors.serviceType = !formData.serviceType;

        newErrors.experience = {
          empty: !formData.experience,
          notNumber: isNaN(Number(formData.experience)),
        };

        newErrors.cost = {
          empty: !formData.cost,
          notNumber: isNaN(Number(formData.cost)),
          zeroOrNegative: Number(formData.cost) <= 0,
        };
      }
    }

    setErrors(newErrors);

    // Проверяем, есть ли хотя бы одна ошибка
    return !Object.values(newErrors).some((error) =>
      typeof error === "object" ? Object.values(error).some(Boolean) : error
    );
  };
  // Обработчик изменения данных формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedData: Partial<Item> = {
        ...prev,
        [name]: e.target.type === "number" ? Number(value) || null : value,
      };

      // Если сменился тип объявления, обнуляем ТОЛЬКО поля, специфичные для старой категории
      if (name === "type") {
        const resetFields: Partial<Item> = { ...updatedData };

        if (value === "Недвижимость") {
          // Обнуляем только поля для Недвижимости
          if ("brand" in resetFields) delete resetFields.brand;
          if ("model" in resetFields) delete resetFields.model;
          if ("year" in resetFields) delete resetFields.year;
          if ("mileage" in resetFields) delete resetFields.mileage;
          if ("serviceType" in resetFields) delete resetFields.serviceType;
          if ("experience" in resetFields) delete resetFields.experience;
          if ("cost" in resetFields) delete resetFields.cost;
          if ("workSchedule" in resetFields) delete resetFields.workSchedule;
        } else if (value === "Авто") {
          // Обнуляем только поля для Авто
          if ("propertyType" in resetFields) delete resetFields.propertyType;
          if ("area" in resetFields) delete resetFields.area;
          if ("rooms" in resetFields) delete resetFields.rooms;
          if ("price" in resetFields) delete resetFields.price;
          if ("serviceType" in resetFields) delete resetFields.serviceType;
          if ("experience" in resetFields) delete resetFields.experience;
          if ("cost" in resetFields) delete resetFields.cost;
          if ("workSchedule" in resetFields) delete resetFields.workSchedule;
        } else if (value === "Услуги") {
          // Обнуляем только поля для Услуг
          if ("propertyType" in resetFields) delete resetFields.propertyType;
          if ("area" in resetFields) delete resetFields.area;
          if ("rooms" in resetFields) delete resetFields.rooms;
          if ("price" in resetFields) delete resetFields.price;
          if ("brand" in resetFields) delete resetFields.brand;
          if ("model" in resetFields) delete resetFields.model;
          if ("year" in resetFields) delete resetFields.year;
          if ("mileage" in resetFields) delete resetFields.mileage;
        }

        updatedData = { ...resetFields };
      }

      // Сохраняем данные в localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      return updatedData;
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (id) {
        await updateItem(Number(id), formData);
      } else {
        await createItem(formData as Item);
      }

      navigate("/list");
      setIsModalOpen(false);

      localStorage.removeItem("formData");
      setErrors({
        name: false,
        description: false,
        location: false,
        image: false,
      });
      setIsFormValid(false);
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(2);
    }
  };
  const handleBackStep = () => {
    setErrors({
      name: false,
      description: false,
      location: false,
      image: false,
    });
    setStep(1);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
        navigate("/list");
      }}
      contentLabel="Создание объявления"
      className="modal"
      overlayClassName="overlay"
    >
      <form onSubmit={handleSubmit} className="form">
        <h1>{id ? "Редактирование объявления" : "Создание объявления"}</h1>

        {/* Первый шаг */}
        {step === 1 && (
          <div className="step1">
            <input
              name="name"
              className={errors.name ? "input error" : "input"}
              placeholder="Название"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <span className="error">Не заполнено название объявления</span>
            )}
            <input
              name="description"
              className={errors.description ? "input error" : "input"}
              placeholder="Описание"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <span className="error">Не заполнено описание</span>
            )}
            <input
              name="location"
              className={errors.location ? "input error" : "input"}
              placeholder="Местонахождение"
              value={formData.location}
              onChange={handleChange}
              required
            />
            {errors.location && (
              <span className="error">Не заполнено местонахождение</span>
            )}
            <input
              name="image"
              placeholder="Изображение"
              value={formData.image}
              onChange={handleChange}
              className={errors.image ? "input error" : "input"}
            />
            {errors.image && (
              <span className="error">
                Введите ссылку на изображение или оставьте поле пустым
              </span>
            )}
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Недвижимость">Недвижимость</option>
              <option value="Авто">Авто</option>
              <option value="Услуги">Услуги</option>
            </select>
            <button type="button" onClick={handleNextStep}>
              Далее
            </button>
          </div>
        )}

        {/* Второй шаг */}
        {step === 2 && (
          <div className="step2">
            {formData.type === "Недвижимость" && (
              <>
                <select
                  name="propertyType"
                  value={formData.propertyType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите тип недвижимости</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  name="area"
                  placeholder="Площадь"
                  value={formData.area ?? ""}
                  onChange={handleChange}
                  className={
                    errors.area && Object.values(errors.area).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                {errors.area && (
                  <span className="error">
                    <div className="error-messages">
                      {errors.area?.empty && (
                        <span>Заполните размер площади</span>
                      )}
                      {errors.area?.notNumber && (
                        <span>Значение должно быть числовым</span>
                      )}
                      {errors.area?.zeroOrNegative && (
                        <span>Значение должно быть больше 0</span>
                      )}
                    </div>
                  </span>
                )}
                <input
                  name="rooms"
                  placeholder="Количество комнат"
                  value={formData.rooms ?? ""}
                  onChange={handleChange}
                  className={
                    errors.rooms && Object.values(errors.rooms).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.rooms?.empty && (
                    <span>Заполните количество комнат</span>
                  )}
                  {errors.rooms?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                  {errors.rooms?.zeroOrNegative && (
                    <span>Значение должно быть больше 0</span>
                  )}
                </div>
                <input
                  name="price"
                  placeholder="Цена"
                  value={formData.price ?? ""}
                  onChange={handleChange}
                  className={
                    errors.price && Object.values(errors.price).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.price?.empty && (
                    <span>Заполните цену недвижимости</span>
                  )}
                  {errors.price?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                  {errors.price?.zeroOrNegative && (
                    <span>Значение должно быть больше 0</span>
                  )}
                </div>
              </>
            )}

            {formData.type === "Авто" && (
              <>
                <select
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите марку</option>
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <input
                  name="model"
                  placeholder="Модель"
                  value={formData.model || ""}
                  onChange={handleChange}
                />
                <input
                  name="year"
                  placeholder="Год"
                  value={formData.year ?? ""}
                  onChange={handleChange}
                  className={
                    errors.year && Object.values(errors.year).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.year?.empty && (
                    <span>Заполните год выпуска автомобиля</span>
                  )}
                  {errors.year?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                  {errors.year?.zeroOrNegative && (
                    <span>Значение должно быть больше 1900</span>
                  )}
                </div>
                <input
                  name="mileage"
                  placeholder="Пробег"
                  value={formData.mileage ?? ""}
                  onChange={handleChange}
                  className={
                    errors.mileage &&
                    Object.values(errors.mileage).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.mileage?.empty && (
                    <span>Заполните пробег автомобиля</span>
                  )}
                  {errors.mileage?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                  {errors.mileage?.zeroOrNegative && (
                    <span>Значение должно быть больше 0</span>
                  )}
                </div>
              </>
            )}

            {formData.type === "Услуги" && (
              <>
                <select
                  name="serviceType"
                  value={formData.serviceType || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите услугу</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <input
                  name="serviceType"
                  placeholder="Тип услуги"
                  value={formData.serviceType || ""}
                  onChange={handleChange}
                />
                <input
                  name="experience"
                  placeholder="Опыт (лет)"
                  value={formData.experience ?? ""}
                  onChange={handleChange}
                  className={
                    errors.experience &&
                    Object.values(errors.experience).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.mileage?.empty && <span>Заполните стаж в годах</span>}
                  {errors.mileage?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                </div>
                <input
                  name="cost"
                  placeholder="Стоимость"
                  value={formData.cost ?? ""}
                  onChange={handleChange}
                  className={
                    errors.cost && Object.values(errors.cost).some(Boolean)
                      ? "input error"
                      : "input"
                  }
                />
                <div className="error-messages">
                  {errors.cost?.empty && (
                    <span>Заполните стоимость услуги</span>
                  )}
                  {errors.cost?.notNumber && (
                    <span>Значение должно быть числовым</span>
                  )}
                  {errors.cost?.zeroOrNegative && (
                    <span>Значение должно быть больше 0</span>
                  )}
                </div>
                <input
                  name="workSchedule"
                  placeholder="График работы"
                  value={formData.workSchedule || ""}
                  onChange={handleChange}
                />
              </>
            )}

            {/* Кнопки управления шагами */}
            <button type="button" onClick={handleBackStep}>
              Назад
            </button>
            <button type="submit">Сохранить</button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ItemForm;
