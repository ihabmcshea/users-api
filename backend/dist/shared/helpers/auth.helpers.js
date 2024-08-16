"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelpers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(password, 10, (err, hashedPassword) => {
            if (err)
                reject(err);
            resolve(hashedPassword);
        });
    });
};
exports.AuthHelpers = {
    hash,
};
//# sourceMappingURL=auth.helpers.js.map