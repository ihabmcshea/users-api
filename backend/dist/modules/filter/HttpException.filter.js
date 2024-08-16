"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const types_helpers_1 = require("../../shared/helpers/types.helpers");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        console.log('exceptionResponse', exceptionResponse);
        console.log(exceptionResponse.message);
        const errorResponse = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message.reduce((acc, message) => {
                const key = message.split('').toLowerCase();
                acc[key] = message;
                return acc;
            }, {})
            : (0, types_helpers_1.isObject)(exceptionResponse.message)
                ? exceptionResponse.message
                : exceptionResponse.message && exceptionResponse.message.includes(':')
                    ? { [exceptionResponse.message.split(':')[0].toLowerCase()]: exceptionResponse.message.split(':')[1] }
                    : exceptionResponse.message
                        ? { [exceptionResponse.message.split(' ')[0].toLowerCase()]: exceptionResponse.message }
                        : { generic: 'Something went wrong.' };
        console.log('errorResponse', errorResponse);
        response.status(status).json({
            statusCode: status,
            ...errorResponse,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=HttpException.filter.js.map