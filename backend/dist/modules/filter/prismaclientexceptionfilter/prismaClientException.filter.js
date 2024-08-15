'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.PrismaClientExceptionFilter = void 0;
const common_1 = require('@nestjs/common');
const library_1 = require('@prisma/client/runtime/library');
let PrismaClientExceptionFilter = class PrismaClientExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = 409;
    let message = 'Conflict occurred';
    if (exception.code === 'P2002') {
      const target = exception.meta?.target;
      message = `Unique constraint failed on the fields: (${target})`;
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
};
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter = __decorate(
  [(0, common_1.Catch)(library_1.PrismaClientKnownRequestError)],
  PrismaClientExceptionFilter,
);
//# sourceMappingURL=prismaClientException.filter.js.map
