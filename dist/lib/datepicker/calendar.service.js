import { Injectable } from '@angular/core';
var CalendarService = (function () {
    function CalendarService() {
        this.firstWeekDay = 0; // 0 = sunday
    }
    CalendarService.prototype.getDays = function (days) {
        return days.slice(this.firstWeekDay, days.length)
            .concat(days.slice(0, this.firstWeekDay));
    };
    CalendarService.prototype.weekStartDate = function (date) {
        var startDate = new Date(date.getTime());
        while (startDate.getDay() !== this.firstWeekDay) {
            startDate.setDate(startDate.getDate() - 1);
        }
        return startDate;
    };
    CalendarService.prototype.monthDates = function (year, month, dayFormatter, weekFormatter) {
        if (dayFormatter === void 0) { dayFormatter = null; }
        if (weekFormatter === void 0) { weekFormatter = null; }
        if ((typeof year !== "number") || (year < 1970)) {
            throw ('year must be a number >= 1970');
        }
        ;
        if ((typeof month !== "number") || (month < 0) || (month > 11)) {
            throw ('month must be a number (Jan is 0)');
        }
        ;
        var weeks = [], week = [], i = 0, currentDate = new Date(), date = this.weekStartDate(new Date(year, month, 1, currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds()));
        do {
            for (i = 0; i < 7; i++) {
                week.push(dayFormatter ? dayFormatter(date) : date);
                date = new Date(date.getTime());
                date.setDate(date.getDate() + 1);
            }
            weeks.push(weekFormatter ? weekFormatter(week) : week);
            week = [];
        } while ((date.getMonth() <= month) && (date.getFullYear() === year));
        return weeks;
    };
    CalendarService.prototype.monthDays = function (year, month) {
        var getDayOrZero = function getDayOrZero(date) {
            return date.getMonth() === month ? date : 0;
        };
        return this.monthDates(year, month, getDayOrZero);
    };
    CalendarService.prototype.monthText = function (year, month) {
        if (typeof year === "undefined") {
            var now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
        }
        ;
        var getDayOrBlank = function getDayOrBlank(date) {
            var s = date.getMonth() === month ? date.getDate().toString() : "  ";
            while (s.length < 2)
                s = " " + s;
            return s;
        };
        var weeks = this.monthDates(year, month, getDayOrBlank, function (week) { return week.join(" "); });
        return weeks.join("\n");
    };
    return CalendarService;
}());
export { CalendarService };
CalendarService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CalendarService.ctorParameters = function () { return []; };
