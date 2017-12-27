export declare class CalendarService {
    firstWeekDay: number;
    constructor();
    getDays(days: any): any;
    weekStartDate(date: any): Date;
    monthDates(year: any, month: any, dayFormatter?: any, weekFormatter?: any): any[];
    monthDays(year: any, month: any): any[];
    monthText(year: any, month: any): string;
}
