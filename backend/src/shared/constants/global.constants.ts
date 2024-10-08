//eslint-disable-next-line
require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRATION;

export enum ROLES_ENUM {
  ADMIN = 'admin',
  USER = 'user',
}

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export const DEFAULT_SORT_BY = 'id';

export const API_PREFIX = '/api/v1';
