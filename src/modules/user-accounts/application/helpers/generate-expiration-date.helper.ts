import { add } from 'date-fns';

export class GenerateExpirationDateHelper {
  static generateDate() {
    return add(new Date(), { minutes: 10 });
  }
}
