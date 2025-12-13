import 'express';
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string | null;
      };
      deviceId?: string | null;
      jti?: string | null;
    }
  }
}
