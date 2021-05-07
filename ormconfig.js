const typeormNamingStrategies = require('typeorm-naming-strategies');
require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });
module.exports = {
   "type": "mysql",
   "host": process.env.MYSQL_HOST,
   "port": process.env.MYSQL_PORT,
   "username": process.env.MYSQL_USER,
   "password": process.env.MYSQL_PASS,
   "database": process.env.MYSQL_DB,
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entities/**/*.ts"
   ],
   "namingStrategy": new typeormNamingStrategies.SnakeNamingStrategy(),
   "cli": {
      "entitiesDir": "src/entity"
   }
}