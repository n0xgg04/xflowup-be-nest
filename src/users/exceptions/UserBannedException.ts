import { HttpException, HttpStatus } from '@nestjs/common';

export class UserBannedException extends HttpException {
  constructor(message: string = 'User is banned from the platform') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
