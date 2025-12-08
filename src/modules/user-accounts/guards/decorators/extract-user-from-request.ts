import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserIdDto } from '../dto/user-id.dto';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserIdDto => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new Error('there is no user in the request object!');
    }

    return user;
  },
);