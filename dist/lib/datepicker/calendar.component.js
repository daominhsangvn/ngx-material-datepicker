import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { animate, trigger, transition, style, keyframes } from '@angular/animations';
import { MD_DIALOG_DATA } from '@angular/material';
import { CalendarService } from './calendar.service';
import { LANG_EN } from './lang-en';
import { DateLocale } from './date-locale';
import { DateUtil } from './date-util';
var CalendarComponent = (function () {
    function CalendarComponent(calendarService, _locale, _util, data) {
        this._locale = _locale;
        this._util = _util;
        this.data = data;
        this._date = null;
        this._value = null;
        this._selected = null;
        this.dateChange = new EventEmitter();
        this.cancel = new EventEmitter();
        this.submit = new EventEmitter();
        this.today = new Date();
        this._years = [];
        this._dates = [];
        this._clockView = 'hour';
        this.timeInterval = 1;
        this.disable24Hr = false;
        this.ampmView = false;
        this.allowMultiDate = false;
        this.selectedDates = [];
        this.calendarService = calendarService;
        this.dayNames = LANG_EN.weekDays;
        this.monthNames = LANG_EN.months;
    }
    Object.defineProperty(CalendarComponent.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (val) {
            this._date = val;
            this.dateChange.emit(val);
            this.updateDate(val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CalendarComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = this.coerceDateProperty(value);
            this.date = this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "min", {
        /** The minimum selectable date. */
        get: function () {
            return this._min;
        },
        set: function (date) {
            this._min = this._util.parse(date);
            this.getYears();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "max", {
        /** The maximum selectable date. */
        get: function () {
            return this._max;
        },
        set: function (date) {
            this._max = this._util.parse(date);
            this.getYears();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "minutes", {
        get: function () {
            return ('0' + this._date.getMinutes()).slice(-2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "hours", {
        get: function () {
            var currentHour = (this._date.getHours() > 12 && this.disable24Hr)
                ? (this._date.getHours() - 12) : this._date.getHours();
            return ('0' + currentHour).slice(-2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "getDateLabel", {
        get: function () {
            return this._locale.getDateLabel(this.date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "getMonthLabel", {
        get: function () {
            return this._locale.getMonthLabel(this.date.getMonth(), this.date.getFullYear());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarComponent.prototype, "ampm", {
        get: function () {
            return this._ampm;
        },
        set: function (value) {
            this._ampm = value;
        },
        enumerable: true,
        configurable: true
    });
    CalendarComponent.prototype.ngOnInit = function () {
        this.date = this.data.date || new Date();
        this.selectedDates = this.data.dates;
        this._isCalendarVisible = this.data.type !== 'time';
        this.disable24Hr = this.data.disable24Hr;
        this.allowMultiDate = this.data.allowMultiDate;
        if (this.allowMultiDate) {
            this._ampm = this.selectedDates && this.selectedDates.length && this.data.type !== 'date' && this.selectedDates[0].getHours() >= 12 ? 'PM' : 'AM';
        }
        else {
            this._ampm = this._date && this._date.getHours() >= 12 ? 'PM' : 'AM';
        }
        this.minDate = this.data.minDate;
        this.maxDate = this.data.maxDate;
    };
    CalendarComponent.prototype.updateDate = function (date) {
        this.currentMonthNumber = date.getMonth();
        this.currentMonth = this.monthNames[this.currentMonthNumber];
        this.currentYear = date.getFullYear();
        this.currentDay = date.getDate();
        this.currentDayOfWeek = this.dayNames[date.getDay()];
        this.updateDisplay(this.currentYear, this.currentMonthNumber);
    };
    CalendarComponent.prototype.updateDisplay = function (year, month) {
        var calendarArray = this.calendarService.monthDays(year, month);
        this.displayDays = [].concat.apply([], calendarArray);
        this.displayMonthNumber = month;
        this.displayMonth = this.monthNames[month];
        this.displayYear = year;
    };
    CalendarComponent.prototype.equalsDate = function (date1, date2) {
        try {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
        }
        catch (error) {
            return false;
        }
    };
    CalendarComponent.prototype.getYears = function () {
        var startYear = this.min ? this.min.getFullYear() : 1900, endYear = this._max ? this._max.getFullYear() : this.today.getFullYear() + 100;
        this._years = [];
        for (var i = startYear; i <= endYear; i++) {
            this._years.push(i);
        }
    };
    CalendarComponent.prototype.coerceDateProperty = function (value) {
        var v = null;
        if (this._util.isValidDate(value)) {
            v = value;
        }
        else {
            if (value && this.data.type === 'time') {
                var t = value + '';
                v = new Date();
                v.setHours(parseInt(t.substring(0, 2)));
                v.setMinutes(parseInt(t.substring(3, 5)));
            }
            else {
                var timestamp = Date.parse(value);
                v = isNaN(timestamp) ? null : new Date(timestamp);
            }
        }
        return v;
    };
    CalendarComponent.prototype._onActiveTimeChange = function (event) {
        this.date = event;
    };
    CalendarComponent.prototype._onTimeChange = function (event) {
        this.value = event;
        if (this._clockView === 'hour') {
            this._clockView = 'minute';
        }
        // else {
        //   this._clockView = 'hour';
        // }
    };
    /**
     * Display Calendar
     */
    CalendarComponent.prototype._showCalendar = function () {
        this._isCalendarVisible = true;
    };
    /**
     * Toggle Hour visiblity
     */
    CalendarComponent.prototype._toggleHours = function (value) {
        this.ampmView = false;
        this._isCalendarVisible = false;
        this._clockView = value;
    };
    CalendarComponent.prototype._toggleAmpm = function () {
        this.ampmView = true;
        this._ampm = this._ampm === 'AM' || !this._ampm ? 'PM' : 'AM';
    };
    CalendarComponent.prototype.getDayBackgroundColor = function (day) {
        var _this = this;
        var equal = false;
        if (this.allowMultiDate) {
            equal = !!(this.selectedDates.length && this.selectedDates.find(function (obj) { return _this.equalsDate(obj, day); }));
        }
        else {
            equal = this.equalsDate(day, this.date);
        }
        if (equal) {
            return 'day-background-selected';
        }
        else {
            return 'day-background-normal';
        }
    };
    CalendarComponent.prototype.getDayForegroundColor = function (day) {
        var _this = this;
        var equal = false;
        if (this.allowMultiDate) {
            equal = !!(this.selectedDates.length && this.selectedDates.find(function (obj) { return _this.equalsDate(obj, day); }));
        }
        else {
            equal = this.equalsDate(day, this.date);
        }
        if (equal) {
            return 'day-foreground-selected';
        }
        else if (this.equalsDate(day, this.today)) {
            return 'day-foreground-today';
        }
        else {
            return 'day-foreground-normal';
        }
    };
    CalendarComponent.prototype.onClear = function () {
        this.submit.emit(null);
    };
    CalendarComponent.prototype.onToday = function () {
        if (this._canActiveDate(this.today)) {
            this.onSelectDate(this.today);
        }
    };
    CalendarComponent.prototype.onPrevMonth = function () {
        if (this.displayMonthNumber > 0) {
            this.updateDisplay(this.displayYear, this.displayMonthNumber - 1);
        }
        else {
            this.updateDisplay(this.displayYear - 1, 11);
        }
        this.triggerAnimation('left');
    };
    CalendarComponent.prototype.onNextMonth = function () {
        if (this.displayMonthNumber < 11) {
            this.updateDisplay(this.displayYear, this.displayMonthNumber + 1);
        }
        else {
            this.updateDisplay(this.displayYear + 1, 0);
        }
        this.triggerAnimation('right');
    };
    CalendarComponent.prototype.onSelectDate = function (date) {
        var _this = this;
        if (this.allowMultiDate) {
            var findedIdx = this.selectedDates.findIndex(function (obj, idx) {
                return _this.equalsDate(obj, date);
            });
            findedIdx > -1 ? this.selectedDates.splice(findedIdx, 1) : this.selectedDates.push(date);
        }
        else {
            this.date = date;
        }
    };
    CalendarComponent.prototype.onCancel = function () {
        this.cancel.emit();
    };
    CalendarComponent.prototype.onOk = function () {
        var _this = this;
        if (this.allowMultiDate) {
            this.selectedDates.map(function (obj) {
                if (_this._ampm === 'PM') {
                    obj.setHours(_this.date.getHours() + 12);
                }
            });
            this.submit.emit(this.selectedDates);
        }
        else {
            if (this._ampm === 'PM') {
                this.date.setHours(this.date.getHours() + 12);
            }
            this.submit.emit(this.date);
        }
    };
    CalendarComponent.prototype.triggerAnimation = function (direction) {
        var _this = this;
        this.animate = direction;
        setTimeout(function () { return _this.animate = 'reset'; }, 230);
    };
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    CalendarComponent.prototype._isSameView = function (date1, date2) {
        return this._isCalendarVisible ?
            this._util.getYear(date1) === this._util.getYear(date2) &&
                this._util.getMonth(date1) === this._util.getMonth(date2) :
            this._util.getYear(date1) === this._util.getYear(date2);
    };
    /** Whether the previous period button is enabled. */
    CalendarComponent.prototype._previousEnabled = function () {
        // if (!this.minDate) {
        //   return true;
        // }
        var startDateOfMonth = new Date(this.displayYear, this.displayMonthNumber, 1);
        return !this.minDate || !this._isSameView(startDateOfMonth, this.minDate);
    };
    /** Whether the next period button is enabled. */
    CalendarComponent.prototype._nextEnabled = function () {
        var startDateOfMonth = new Date(this.displayYear, this.displayMonthNumber, 1);
        return !this.maxDate || !this._isSameView(startDateOfMonth, this.maxDate);
    };
    CalendarComponent.prototype._canActiveDate = function (date) {
        var maxDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, this.maxDate.getDate());
        var minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, this.minDate.getDate());
        var day = date ? new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()) : date;
        return (!maxDate && minDate && minDate <= day) || (!minDate && maxDate && maxDate >= day) ||
            (minDate && minDate <= day && maxDate && maxDate >= day);
    };
    return CalendarComponent;
}());
export { CalendarComponent };
CalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-material-datepicker-calendar',
                template: "\n    <div class=\"ngx-md-datepicker-container\">\n      <div class=\"header ng-material-datepicker\">\n        <a href=\"javascript:void(0)\" class=\"year-date\" (click)=\"_showCalendar()\"\n           *ngIf=\"data.type === 'date' || data.type === 'datetime'\"\n           [class.active]=\"_isCalendarVisible\">\n          <p class=\"year\">{{ currentYear }}</p>\n          <p class=\"date\">{{ getDateLabel }}</p>\n        </a>\n        <div class=\"md2-datepicker-header-time\"\n             *ngIf=\"data.type === 'time' || data.type === 'datetime'\"\n             [class.active]=\"!_isCalendarVisible\">\n          <a href=\"javascript:void(0)\" class=\"md2-datepicker-header-hour\"\n             [class.active]=\"_clockView === 'hour' && !ampmView\"\n             (click)=\"_toggleHours('hour')\">{{ hours }}</a>:<a href=\"javascript:void(0)\"\n                                                               class=\"md2-datepicker-header-minute\"\n                                                               [class.active]=\"_clockView === 'minute' && !ampmView\"\n                                                               (click)=\"_toggleHours('minute')\">{{ minutes }}</a>\n          <a href=\"javascript:void(0)\"\n             *ngIf=\"disable24Hr\"\n             class=\"md2-datepicker-header-ampm\"\n             [class.active]=\"ampmView\"\n             (click)=\"_toggleAmpm()\">{{ ampm }}</a>\n        </div>\n      </div>\n      <div class=\"ngx-md-datepicker-content\">\n        <div class=\"ngx-md-datepicker-inner\">\n          <div class=\"ngx-md-datepicker-calendar\" [class.active]=\"_isCalendarVisible\">\n            <div class=\"nav ng-material-datepicker\">\n              <button md-icon-button class=\"left\" [class.disabled]=\"!_previousEnabled()\" (click)=\"onPrevMonth()\">\n                <md-icon>keyboard_arrow_left</md-icon>\n              </button>\n              <div class=\"title\">\n                <div [@calendarAnimation]=\"animate\">{{ displayMonth.full }} {{ displayYear }}</div>\n              </div>\n              <button md-icon-button class=\"right\" [class.disabled]=\"!_nextEnabled()\" (click)=\"onNextMonth()\">\n                <md-icon>keyboard_arrow_right</md-icon>\n              </button>\n            </div>\n            <div class=\"content ng-material-datepicker\">\n              <div class=\"labels\">\n                <div class=\"label\" *ngFor=\"let day of dayNames\">\n                  {{ day.letter }}\n                </div>\n              </div>\n              <div [@calendarAnimation]=\"animate\" class=\"month\">\n                <div *ngFor=\"let day of displayDays\" class=\"day\"\n                     [class.disabled]=\"!_canActiveDate(day)\"\n                     (click)=\"onSelectDate(day)\"\n                     [ngClass]=\"getDayBackgroundColor(day)\">\n                      <span *ngIf=\"day != 0\" [ngClass]=\"getDayForegroundColor(day)\">\n                          {{ day.getDate() }}\n                        </span>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"ngx-md-datepicker-clock\" [class.active]=\"!_isCalendarVisible\">\n            <ngx-md-clock [startView]=\"_clockView\"\n                          [interval]=\"timeInterval\"\n                          [selected]=\"date\"\n                          [min]=\"min\"\n                          [max]=\"max\"\n                          [twelvehour]=\"disable24Hr\"\n                          (activeDateChange)=\"_onActiveTimeChange($event)\"\n                          (selectedChange)=\"_onTimeChange($event)\"></ngx-md-clock>\n          </div>\n        </div>\n        <div class=\"footer ng-material-datepicker\">\n          <a md-button (click)=\"onToday()\" *ngIf=\"_canActiveDate(today)\">Today</a>\n          <!--<a md-button (click)=\"onCancel()\">Cancel</a>-->\n          <a md-button (click)=\"onOk()\">Ok</a>\n          <a md-button (click)=\"onClear()\">Clear</a>\n        </div>\n      </div>\n    </div>\n  ",
                // styleUrls: ['./calendar.component.scss'],
                animations: [
                    trigger('calendarAnimation', [
                        transition('* => left', [
                            animate('0.225s ease-in-out', keyframes([
                                style({ transform: 'translateX(105%)', offset: 0.5 }),
                                style({ transform: 'translateX(-130%)', offset: 0.51 }),
                                style({ transform: 'translateX(0)', offset: 1 }),
                            ]))
                        ]),
                        transition('* => right', [
                            animate('0.225s ease-in-out', keyframes([
                                style({ transform: 'translateX(-105%)', offset: 0.5 }),
                                style({ transform: 'translateX(130%)', offset: 0.51 }),
                                style({ transform: 'translateX(0)', offset: 1 })
                            ]))
                        ])
                    ])
                ]
            },] },
];
/** @nocollapse */
CalendarComponent.ctorParameters = function () { return [
    { type: CalendarService, },
    { type: DateLocale, },
    { type: DateUtil, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_DIALOG_DATA,] },] },
]; };
CalendarComponent.propDecorators = {
    'dateChange': [{ type: Output },],
    'date': [{ type: Input },],
    'value': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'cancel': [{ type: Output },],
    'submit': [{ type: Output },],
    'timeInterval': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
};
