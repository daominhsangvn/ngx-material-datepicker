import { EventEmitter, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
import { ClockView } from './clock';
import { DateLocale } from './date-locale';
import { DateUtil } from './date-util';
export declare class CalendarComponent implements OnInit {
    private _locale;
    private _util;
    data: any;
    private readonly calendarService;
    private _date;
    private _value;
    private _selected;
    dateChange: EventEmitter<Date>;
    date: Date;
    value: Date;
    /** The minimum selectable date. */
    min: Date;
    private _min;
    /** The maximum selectable date. */
    max: Date;
    private _max;
    readonly minutes: string;
    readonly hours: string;
    readonly getDateLabel: string;
    readonly getMonthLabel: string;
    cancel: EventEmitter<void>;
    submit: EventEmitter<Date>;
    dayNames: Array<Weekday>;
    monthNames: Array<Month>;
    today: Date;
    currentMonth: Month;
    currentMonthNumber: number;
    currentYear: number;
    currentDay: number;
    currentDayOfWeek: Weekday;
    displayMonth: Month;
    displayMonthNumber: number;
    displayYear: number;
    displayDays: Array<number>;
    animate: string;
    _years: Array<number>;
    _dates: Array<Object>;
    _isCalendarVisible: boolean;
    _clockView: ClockView;
    timeInterval: number;
    constructor(calendarService: CalendarService, _locale: DateLocale, _util: DateUtil, data: any);
    ngOnInit(): void;
    private updateDate(date);
    private updateDisplay(year, month);
    private equalsDate(date1, date2);
    private getYears();
    private coerceDateProperty(value);
    _onActiveTimeChange(event: Date): void;
    _onTimeChange(event: Date): void;
    /**
     * Display Calendar
     */
    _showCalendar(): void;
    /**
     * Toggle Hour visiblity
     */
    _toggleHours(value: ClockView): void;
    getDayBackgroundColor(day: Date): "day-background-selected" | "day-background-normal";
    getDayForegroundColor(day: Date): "day-foreground-selected" | "day-foreground-today" | "day-foreground-normal";
    onClear(): void;
    onToday(): void;
    onPrevMonth(): void;
    onNextMonth(): void;
    onSelectDate(date: Date): void;
    onCancel(): void;
    onOk(): void;
    private triggerAnimation(direction);
}
