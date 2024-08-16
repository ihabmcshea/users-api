import { Prisma } from '@prisma/client';
export declare class UserListener {
    static onCreated(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>): Promise<any>;
}
