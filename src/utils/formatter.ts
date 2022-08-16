import { format as formatTZ, utcToZonedTime } from 'date-fns-tz';

export class Formatter {
  static brlCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  static dateUTC(date: Date, formatStr: string) {
    const zoned = utcToZonedTime(date, 'UTC');
    return formatTZ(zoned, formatStr, { timeZone: 'utc' });
  }

  static isoText(date: Date) {
    return this.dateUTC(date, 'yyyy-MM-dd');
  }
}
