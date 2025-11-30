import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validToken = 'Basic YWRtaW46cXdlcnR5'; // Это твой токен

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);
    }

    if (authHeader !== this.validToken) {
      throw new CustomHttpException(DomainExceptionCode.UNAUTHORIZED);
    }

    return true;
  }
}
