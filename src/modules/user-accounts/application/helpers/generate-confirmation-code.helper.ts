export class GenerateConfirmationCodeHelper {
  static generateCode(): string {
    const result: string = Math.floor(1000 + Math.random() * 9000).toString();
    return result;
  }
}
