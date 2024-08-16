import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { isObject } from 'src/shared/helpers/types.helpers';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    console.log('exceptionResponse', exceptionResponse);
    // Map the validation errors to include keys
    console.log(exceptionResponse.message);
    const errorResponse = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message.reduce((acc, message) => {
          if (message) {
            const key = message.split('')[0].toLowerCase(); // Create a simple key from the error message
            acc[key] = message;
          }
          return acc;
        }, {} as Record<string, string>)
      : isObject(exceptionResponse.message)
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
}
