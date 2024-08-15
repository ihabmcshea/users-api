import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserListener } from '../users/users.listener'; 

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Called when the module is initialized. Connects to the database and sets up middleware.
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.$use(UserListener.onCreated); // Setup custom middleware or listeners
      this.logger.log('Database connected successfully.');
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      throw error; // Ensure errors are propagated
    }
  }

  /**
   * Called when the module is destroyed. Disconnects from the database.
   */
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully.');
    } catch (error) {
      this.logger.error('Error disconnecting from the database', error);
    }
  }
}
