'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GLOBAL_CONFIG = void 0;
const global_constants_1 = require('../shared/constants/global.constants');
exports.GLOBAL_CONFIG = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Users CRUD API',
    description: 'The Users CRUD API',
    version: '1.0',
    path: global_constants_1.API_PREFIX,
  },
  security: {
    expiresIn: 3600 * 24,
    bcryptSaltOrRound: 10,
  },
};
//# sourceMappingURL=global.config.js.map
