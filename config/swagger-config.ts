const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    components: {},
    info: {
      title: 'Image Repo API',
      version: '3.0.0',
      description: 'Image Repo API with autogenerated swagger doc',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
      },
    },
    security: [ { bearerAuth: [] } ],
  },
  apis: [ './**/*.ts'],
};

export const specs = swaggerJsdoc(options);