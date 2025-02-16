const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // Можно сменить на 'production' для продакшена
  entry: './index.tsx', // Точка входа в приложение
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Очищает папку dist перед сборкой
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader' // Добавляем PostCSS
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader' // Для SCSS/SASS тоже добавляем PostCSS
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './pages/index.html'
    }),
    new MiniCssExtractPlugin()
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 5000,
    historyApiFallback: true, // Позволяет использовать маршрутизацию React
    open: true // Автоматически открывает браузер
  }
};
