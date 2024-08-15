import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Subscribe to the email verification channel when the module is initialized
    await this.redisService.subscribe('email_verification', this.handleEmailVerification.bind(this));
  }

  /**
   * Handles incoming email verification messages from Redis and sends the email.
   * @param message - JSON string containing email verification details
   */
  async handleEmailVerification(message: string) {
    try {
      const { email, name, token } = JSON.parse(message);

      // Validate the received data
      if (!email || !name || !token) {
        throw new Error('Invalid message format for email verification');
      }

      // Send the email using the mailer service
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        template: './verification', // Path to the email template
        context: {
          name,
          token, // Pass token to the template
          email, // Pass email to the template if needed
          apiURL: this.configService.get<String>("API_URL")
        },
      });

      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      // Log error and handle it appropriately
      console.error('Failed to send verification email:', error.message);
    }
  }
}
