import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject
} from '@angular/core';
import {
  animate,
  trigger,
  transition,
  style,
  keyframes
} from '@angular/animations';
import { MD_DIALOG_DATA } from '@angular/material';
import { CalendarService } from './calendar.service';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
import { LANG_EN } from './lang-en';
import { ClockView } from './clock';
import { DateLocale } from './date-locale';
import { DateUtil } from './date-util';

@Component({
  selector: 'ngx-material-datepicker-calendar',
  template: `
    <div class="ngx-md-datepicker-container">
      <div class="header ng-material-datepicker">
        <a href="javascript:void(0)" class="year-date" (click)="_showCalendar()"
           *ngIf="data.type === 'date' || data.type === 'datetime'"
           [class.active]="_isCalendarVisible">
          <p class="year">{{ currentYear }}</p>
          <p class="date">{{ getDateLabel }}</p>
        </a>
        <div class="md2-datepicker-header-time"
             *ngIf="data.type === 'time' || data.type === 'datetime'"
             [class.active]="!_isCalendarVisible">
          <a href="javascript:void(0)" class="md2-datepicker-header-hour"
             [class.active]="_clockView === 'hour' && !ampmView"
             (click)="_toggleHours('hour')">{{ hours }}</a>:<a href="javascript:void(0)"
                                                               class="md2-datepicker-header-minute"
                                                               [class.active]="_clockView === 'minute' && !ampmView"
                                                               (click)="_toggleHours('minute')">{{ minutes }}</a>
          <a href="javascript:void(0)"
             *ngIf="disable24Hr"
             class="md2-datepicker-header-ampm"
             [class.active]="ampmView"
             (click)="_toggleAmpm()">{{ ampm }}</a>
        </div>
      </div>
      <div class="ngx-md-datepicker-content">
        <div class="ngx-md-datepicker-inner">
          <div class="ngx-md-datepicker-calendar" [class.active]="_isCalendarVisible">
            <div class="nav ng-material-datepicker">
              <button md-icon-button class="left" [class.disabled]="!_previousEnabled()" (click)="onPrevMonth()">
                <md-icon>keyboard_arrow_left</md-icon>
              </button>
              <div class="title">
                <div [@calendarAnimation]="animate">{{ displayMonth.full }} {{ displayYear }}</div>
              </div>
              <button md-icon-button class="right" [class.disabled]="!_nextEnabled()" (click)="onNextMonth()">
                <md-icon>keyboard_arrow_right</md-icon>
              </button>
            </div>
            <div class="content ng-material-datepicker">
              <div class="labels">
                <div class="label" *ngFor="let day of dayNames">
                  {{ day.letter }}
                </div>
              </div>
              <div [@calendarAnimation]="animate" class="month">
                <div *ngFor="let day of displayDays" class="day" (click)="onSelectDate(day)"
                     [ngClass]="getDayBackgroundColor(day)">
                      <span *ngIf="day != 0" [ngClass]="getDayForegroundColor(day)">
                          {{ day.getDate() }}
                        </span>
                </div>
              </div>
            </div>
          </div>
          <div class="ngx-md-datepicker-clock" [class.active]="!_isCalendarVisible">
            <ngx-md-clock [startView]="_clockView"
                          [interval]="timeInterval"
                          [selected]="date"
                          [min]="min"
                          [max]="max"
                          [twelvehour]="disable24Hr"
                          (activeDateChange)="_onActiveTimeChange($event)"
                          (selectedChange)="_onTimeChange($event)"></ngx-md-clock>
          </div>
        </div>
        <div class="footer ng-material-datepicker">
          <a md-button (click)="onToday()">Today</a>
          <!--<a md-button (click)="onCancel()">Cancel</a>-->
          <a md-button (click)="onOk()">Ok</a>
          <a md-button (click)="onClear()">Clear</a>
        </div>
      </div>
    </div>
  `,
  // styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('calendarAnimation', [
      transition('* => left', [
        animate('0.225s ease-in-out', keyframes([
          style({transform: 'translateX(105%)', offset: 0.5}),
          style({transform: 'translateX(-130%)', offset: 0.51}),
          style({transform: 'translateX(0)', offset: 1}),
        ]))
      ]),
      transition('* => right', [
        animate('0.225s ease-in-out', keyframes([
          style({transform: 'translateX(-105%)', offset: 0.5}),
          style({transform: 'translateX(130%)', offset: 0.51}),
          style({transform: 'translateX(0)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class CalendarComponent implements OnInit {

  private readonly calendarService: CalendarService;

  private _date: Date = null;
  private _value: Date = null;
  private _selected: Date = null;

  @Output()
  dateChange = new EventEmitter<Date>();

  @Input()
  get date(): Date {
    return this._date;
  };

  set date(val: Date) {
    this._date = val;
    this.dateChange.emit(val);
    this.updateDate(val);
  }

  @Input()
  get value() {
    return this._value;
  }

  set value(value: Date) {
    this._value = this.coerceDateProperty(value);
    this.date = this._value;
  }

  /** The minimum selectable date. */
  @Input()
  get min(): Date {
    return this._min;
  }

  set min(date: Date) {
    this._min = this._util.parse(date);
    this.getYears();
  }

  private _min: Date;

  /** The maximum selectable date. */
  @Input()
  get max(): Date {
    return this._max;
  }

  set max(date: Date) {
    this._max = this._util.parse(date);
    this.getYears();
  }

  private _max: Date;

  get minutes(): string {
    return ('0' + this._date.getMinutes()).slice(-2);
  }

  get hours(): string {
    const currentHour = (this._date.getHours() > 12 && this.disable24Hr)
      ? (this._date.getHours() - 12) : this._date.getHours();
    return ('0' + currentHour ).slice(-2);
  }

  get getDateLabel(): string {
    return this._locale.getDateLabel(this.date);
  }

  get getMonthLabel(): string {
    return this._locale.getMonthLabel(this.date.getMonth(), this.date.getFullYear());
  }

  private _ampm: string;

  get ampm(): string {
    return this._ampm;
  }

  set ampm(value) {
    this._ampm = value;
  }


  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  submit = new EventEmitter<any>();

  dayNames: Array<Weekday>;
  monthNames: Array<Month>;
  today: Date = new Date();

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
  _years: Array<number> = [];
  _dates: Array<Object> = [];
  _isCalendarVisible: boolean;
  _clockView: ClockView = 'hour';
  @Input() timeInterval: number = 1;


  disable24Hr: boolean = false;
  ampmView: boolean = false;

  allowMultiDate: boolean = false;
  selectedDates: Date[] = [];

  /** The minimum selectable date. */
  @Input() minDate: Date;

  /** The maximum selectable date. */
  @Input() maxDate: Date;

  constructor(calendarService: CalendarService,
              private _locale: DateLocale,
              private _util: DateUtil,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.calendarService = calendarService;
    this.dayNames = LANG_EN.weekDays;
    this.monthNames = LANG_EN.months;
  }

  ngOnInit() {
    this.date = this.data.date || new Date();

    this.selectedDates = this.data.dates;
    this._isCalendarVisible = this.data.type !== 'time';

    this.disable24Hr = this.data.disable24Hr;

    this.allowMultiDate = this.data.allowMultiDate;

    if (this.allowMultiDate) {
      this._ampm = this.selectedDates && this.selectedDates.length && this.data.type !== 'date' && this.selectedDates[0].getHours() >= 12 ? 'PM' : 'AM';
    } else {
      this._ampm = this._date && this._date.getHours() >= 12 ? 'PM' : 'AM';
    }

    this.minDate = this.data.minDate;
    this.maxDate = this.data.maxDate;
  }

  private updateDate(date: Date) {
    this.currentMonthNumber = date.getMonth();
    this.currentMonth = this.monthNames[this.currentMonthNumber];
    this.currentYear = date.getFullYear();
    this.currentDay = date.getDate();
    this.currentDayOfWeek = this.dayNames[date.getDay()];
    this.updateDisplay(this.currentYear, this.currentMonthNumber);
  }

  private updateDisplay(year: number, month: number) {
    const calendarArray = this.calendarService.monthDays(year, month);
    this.displayDays = [].concat.apply([], calendarArray);
    this.displayMonthNumber = month;
    this.displayMonth = this.monthNames[month];
    this.displayYear = year;
  }

  private equalsDate(date1: Date, date2: Date): boolean {
    try {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }
    catch (error) {
      return false;
    }
  }

  private getYears() {
    let startYear = this.min ? this.min.getFullYear() : 1900,
      endYear = this._max ? this._max.getFullYear() : this.today.getFullYear() + 100;
    this._years = [];
    for (let i = startYear; i <= endYear; i++) {
      this._years.push(i);
    }
  }

  private coerceDateProperty(value: any): Date {
    let v: Date = null;
    if (this._util.isValidDate(value)) {
      v = value;
    } else {
      if (value && this.data.type === 'time') {
        let t = value + '';
        v = new Date();
        v.setHours(parseInt(t.substring(0, 2)));
        v.setMinutes(parseInt(t.substring(3, 5)));
      } else {
        let timestamp = Date.parse(value);
        v = isNaN(timestamp) ? null : new Date(timestamp);
      }
    }
    return v;
  }

  _onActiveTimeChange(event: Date) {
    this.date = event;
  }

  _onTimeChange(event: Date) {
    this.value = event;
    if (this._clockView === 'hour') {
      this._clockView = 'minute';
    }
    // else {
    //   this._clockView = 'hour';
    // }
  }

  /**
   * Display Calendar
   */
  _showCalendar() {
    this._isCalendarVisible = true;
  }

  /**
   * Toggle Hour visiblity
   */
  _toggleHours(value: ClockView) {
    this.ampmView = false;
    this._isCalendarVisible = false;
    this._clockView = value;
  }

  _toggleAmpm() {
    this.ampmView = true;
    this._ampm = this._ampm === 'AM' || !this._ampm ? 'PM' : 'AM';
  }

  getDayBackgroundColor(day: Date) {
    let equal = false;

    if (this.allowMultiDate) {
      equal = !!(this.selectedDates.length && this.selectedDates.find((obj) => this.equalsDate(obj, day)));
    } else {
      equal = this.equalsDate(day, this.date);
    }
    if (equal) {
      return 'day-background-selected';
    } else {
      return 'day-background-normal';
    }
  }

  getDayForegroundColor(day: Date) {
    let equal = false;

    if (this.allowMultiDate) {
      equal = !!(this.selectedDates.length && this.selectedDates.find((obj) => this.equalsDate(obj, day)));
    } else {
      equal = this.equalsDate(day, this.date);
    }

    if (equal) {
      return 'day-foreground-selected';
    } else if (this.equalsDate(day, this.today)) {
      return 'day-foreground-today';
    } else {
      return 'day-foreground-normal';
    }
  }

  onClear() {
    this.submit.emit(null);
  }

  onToday() {
    this.onSelectDate(this.today);
  }

  onPrevMonth() {
    if (this.displayMonthNumber > 0) {
      this.updateDisplay(this.displayYear, this.displayMonthNumber - 1);
    } else {
      this.updateDisplay(this.displayYear - 1, 11);
    }
    this.triggerAnimation('left');
  }

  onNextMonth() {
    if (this.displayMonthNumber < 11) {
      this.updateDisplay(this.displayYear, this.displayMonthNumber + 1);
    } else {
      this.updateDisplay(this.displayYear + 1, 0);
    }
    this.triggerAnimation('right');
  }

  onSelectDate(date: Date) {

    if (this.allowMultiDate) {
      const findedIdx = this.selectedDates.findIndex((obj, idx) => {
        return this.equalsDate(obj, date);
      });

      findedIdx > -1 ? this.selectedDates.splice(findedIdx, 1) : this.selectedDates.push(date);

    } else {
      this.date = date;
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onOk() {
    if (this.allowMultiDate) {

      this.selectedDates.map((obj) => {
        if (this._ampm === 'PM') {
          obj.setHours(this.date.getHours() + 12);
        }
      });
      this.submit.emit(this.selectedDates);
    } else {
      if (this._ampm === 'PM') {
        this.date.setHours(this.date.getHours() + 12);
      }

      this.submit.emit(this.date);
    }
  }

  private triggerAnimation(direction: string): void {
    this.animate = direction;
    setTimeout(() => this.animate = 'reset', 230);
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: Date, date2: Date): boolean {

    console.log(this._isCalendarVisible ?
      this._util.getYear(date1) === this._util.getYear(date2) &&
      this._util.getMonth(date1) === this._util.getMonth(date2) :
      this._util.getYear(date1) === this._util.getYear(date2));
    return this._isCalendarVisible ?
      this._util.getYear(date1) === this._util.getYear(date2) &&
      this._util.getMonth(date1) === this._util.getMonth(date2) :
      this._util.getYear(date1) === this._util.getYear(date2);
  }

  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    const firstActive = this.allowMultiDate && this.selectedDates ? this.selectedDates[0] : this.date;
    return !this.minDate || !this._isSameView(firstActive || new Date(), this.minDate);
  }

  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean {

    const firstActive = this.allowMultiDate && this.selectedDates ? this.selectedDates[0] : this.date;
    return !this.maxDate || !firstActive || !this._isSameView(firstActive || new Date(), this.maxDate);
  }
}
