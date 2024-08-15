import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AuthHelpers } from '../../shared/helpers/auth.helpers'; // Adjust the import path as needed

@Injectable()
export class UserListener {
  static async onCreated(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ): Promise<any> {
    // Check if the model is 'User'
    if (params.model === 'User') {
      const password = params.args?.data?.password;

      // Encrypt password on create or update actions if it exists
      if ((params.action === 'create' || params.action === 'update') && password) {
        try {
          const encryptedPassword = await AuthHelpers.hash(password);
          params.args.data = {
            ...params.args.data,
            password: encryptedPassword,
          };
        } catch (error) {
          console.error('Error encrypting password:', error);
          throw new Error('Password encryption failed');
        }
      }
    }

    return next(params);
  }
}
