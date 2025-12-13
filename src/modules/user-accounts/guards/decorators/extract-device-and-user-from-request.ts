import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractDeviceAndUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('No user payload in request. Did you forget to use JwtRefreshGuard?');
    }
    if (!request.user.deviceId) {
      throw new Error('No deviceId in refresh token payload!');
    }
    return {
      userId: request.user.userId,
      deviceId: request.user.deviceId,
    };

  },
);