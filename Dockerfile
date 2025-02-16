# Используем Node.js 16
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Открываем порт 5000 для Webpack Dev Server
EXPOSE 5000

# Запускаем Webpack Dev Server
CMD ["npm", "run", "start"]