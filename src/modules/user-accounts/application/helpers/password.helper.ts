import * as bcrypt from 'bcrypt';
import crypto from 'node:crypto';

export class PasswordHelper {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async generateRandomBytes(): Promise<string> {
    return crypto.randomBytes(16).toString('hex');
  }
}
