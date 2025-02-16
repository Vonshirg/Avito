module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Убедитесь, что указана правильная среда
  transform: {
    '^.+\\.tsx?$': 'ts-jest' // если используете TypeScript
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testEnvironment: 'jest-fixed-jsdom'
};
