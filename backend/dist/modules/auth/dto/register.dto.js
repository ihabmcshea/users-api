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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
class RegisterDto {}
exports.RegisterDto = RegisterDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The email of the user',
      example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata('design:type', String),
  ],
  RegisterDto.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The first name of the user',
      example: 'John',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  RegisterDto.prototype,
  'firstName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The last name of the user',
      example: 'Doe',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  RegisterDto.prototype,
  'lastName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'The password for the user account',
      example: 'strongPassword123',
      minLength: 8,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata('design:type', String),
  ],
  RegisterDto.prototype,
  'password',
  void 0,
);
//# sourceMappingURL=register.dto.js.map
