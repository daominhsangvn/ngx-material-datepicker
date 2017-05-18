import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DateUtil } from './date-util';
import { DateLocale } from './date-locale';
export var CLOCK_RADIUS = 50;
export var CLOCK_INNER_RADIUS = 27.5;
export var CLOCK_OUTER_RADIUS = 41.25;
export var CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datepicker.
 * @docs-private
 */
var NgxMaterialClock = (function () {
    function NgxMaterialClock(_element, _locale, _util) {
        var _this = this;
        this._element = _element;
        this._locale = _locale;
        this._util = _util;
        this.interval = 1;
        this.twelvehour = false;
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        this.activeDateChange = new EventEmitter();
        /** Hours and Minutes representing the clock view. */
        this._hours = [];
        this._minutes = [];
        /** Whether the clock is in hour view. */
        this._hourView = true;
        this.mouseMoveListener = function (event) { _this._handleMousemove(event); };
        this.mouseUpListener = function (event) { _this._handleMouseup(event); };
    }
    Object.defineProperty(NgxMaterialClock.prototype, "activeDate", {
        /**
         * The date to display in this clock view.
         */
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate = this._util.clampDate(value, this.min, this.max);
            if (!this._util.isSameMinute(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxMaterialClock.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = this._util.parse(value);
            if (this._selected) {
                this.activeDate = this._selected;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxMaterialClock.prototype, "min", {
        /** The minimum selectable date. */
        get: function () { return this._min; },
        set: function (date) { this._min = this._util.parse(date); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxMaterialClock.prototype, "max", {
        /** The maximum selectable date. */
        get: function () { return this._max; },
        set: function (date) { this._max = this._util.parse(date); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxMaterialClock.prototype, "startView", {
        /** Whether the clock should be started in hour or minute view. */
        set: function (value) {
            this._hourView = value != 'minute';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxMaterialClock.prototype, "_hand", {
        get: function () {
            this._selectedHour = this._util.getHour(this.activeDate);
            this._selectedMinute = this._util.getMinute(this.activeDate);
            var deg = 0;
            var radius = CLOCK_OUTER_RADIUS;
            if (this._hourView) {
                var outer = this.activeDate.getHours() > 0 && this.activeDate.getHours() < 13;
                radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
                if (this.twelvehour) {
                    radius = CLOCK_OUTER_RADIUS;
                }
                deg = Math.round(this.activeDate.getHours() * (360 / (24 / 2)));
            }
            else {
                deg = Math.round(this.activeDate.getMinutes() * (360 / 60));
            }
            return {
                'transform': "rotate(" + deg + "deg)",
                'height': radius + "%",
                'margin-top': 50 - radius + "%"
            };
        },
        enumerable: true,
        configurable: true
    });
    NgxMaterialClock.prototype.ngAfterContentInit = function () {
        this.activeDate = this._activeDate || this._util.today();
        this._init();
    };
    /** Handles hour selection in the clock view. */
    NgxMaterialClock.prototype._hourSelected = function () {
        this._hourView = false;
    };
    /** Handles minute selection in the clock view. */
    NgxMaterialClock.prototype._minuteSelected = function () {
        this._hourView = true;
    };
    /** Handles mousedown events on the clock body. */
    NgxMaterialClock.prototype._handleMousedown = function (event) {
        this.setTime(event);
        document.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('touchmove', this.mouseMoveListener);
        document.addEventListener('mouseup', this.mouseUpListener);
        document.addEventListener('touchend', this.mouseUpListener);
    };
    NgxMaterialClock.prototype._handleMousemove = function (event) {
        event.preventDefault();
        this.setTime(event);
    };
    NgxMaterialClock.prototype._handleMouseup = function (event) {
        document.removeEventListener('mousemove', this.mouseMoveListener);
        document.removeEventListener('touchmove', this.mouseMoveListener);
        document.removeEventListener('mouseup', this.mouseUpListener);
        document.removeEventListener('touchend', this.mouseUpListener);
        this.selectedChange.emit(this.activeDate);
        if (this._hourView) {
            this._hourSelected();
        }
        else {
            //this._minuteSelected();
        }
    };
    /** Initializes this clock view. */
    NgxMaterialClock.prototype._init = function () {
        this._hours.length = 0;
        this._minutes.length = 0;
        if (this.twelvehour) {
            for (var i = 1; i < 13; i++) {
                var radian = i / 6 * Math.PI;
                var radius = CLOCK_OUTER_RADIUS;
                var date = new Date(this.activeDate.getTime());
                date.setHours(i + 1, 0, 0, 0);
                var enabled = this._util.isDateWithinRange1(date, this.min, this.max);
                this._hours.push({
                    value: i,
                    displayValue: i === 0 ? '00' : i,
                    enabled: enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                });
            }
        }
        else {
            for (var i = 0; i < 24; i++) {
                var radian = i / 6 * Math.PI;
                var outer = i > 0 && i < 13, radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
                var date = new Date(this.activeDate.getTime());
                date.setHours(i + 1, 0, 0, 0);
                var enabled = this._util.isDateWithinRange1(date, this.min, this.max);
                this._hours.push({
                    value: i,
                    displayValue: i === 0 ? '00' : i,
                    enabled: enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                    fontSize: i > 0 && i < 13 ? '' : '100%'
                });
            }
        }
        for (var i = 0; i < 60; i += 5) {
            var radian = i / 30 * Math.PI;
            var date = new Date(this.activeDate.getTime());
            date.setMinutes(i, 0, 0);
            var enabled = this._util.isDateWithinRange1(date, this.min, this.max);
            this._minutes.push({
                value: i,
                displayValue: i === 0 ? '00' : i,
                enabled: enabled,
                top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
                left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
            });
        }
    };
    /**
     * Set Time
     * @param event
     */
    NgxMaterialClock.prototype.setTime = function (event) {
        var trigger = this._element.nativeElement;
        var triggerRect = trigger.getBoundingClientRect();
        var width = trigger.offsetWidth;
        var height = trigger.offsetHeight;
        var pageX = event.pageX !== undefined ? event.pageX : event.touches[0].pageX;
        var pageY = event.pageY !== undefined ? event.pageY : event.touches[0].pageY;
        var x = (width / 2) - (pageX - triggerRect.left - window.pageXOffset);
        var y = (height / 2) - (pageY - triggerRect.top - window.pageYOffset);
        var radian = Math.atan2(-x, y);
        var unit = Math.PI / (this._hourView ? 6 : (this.interval ? (30 / this.interval) : 30));
        var z = Math.sqrt(x * x + y * y);
        var outer = this._hourView && z > ((width * (CLOCK_OUTER_RADIUS / 100)) +
            (width * (CLOCK_INNER_RADIUS / 100))) / 2;
        var value = 0;
        if (radian < 0) {
            radian = Math.PI * 2 + radian;
        }
        value = Math.round(radian / unit);
        radian = value * unit;
        var date = new Date(this.activeDate.getTime());
        if (this._hourView) {
            if (this.twelvehour) {
                value = value === 0 ? 12 : value;
            }
            else {
                if (value === 12) {
                    value = 0;
                }
                value = outer ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
            }
            date.setHours(value);
        }
        else {
            if (this.interval) {
                value *= this.interval;
            }
            if (value === 60) {
                value = 0;
            }
            date.setMinutes(value);
        }
        this.activeDate = this._util.clampDate(date, this.min, this.max);
        this.activeDateChange.emit(this.activeDate);
    };
    return NgxMaterialClock;
}());
export { NgxMaterialClock };
NgxMaterialClock.decorators = [
    { type: Component, args: [{
                selector: 'ngx-md-clock',
                template: "\n<div class=\"ngx-md-clock\">\n  <div class=\"ngx-md-clock-center\"></div>\n  <div class=\"ngx-md-clock-hand\" [ngStyle]=\"_hand\"></div>\n  <div class=\"ngx-md-clock-hours\" [class.active]=\"_hourView\">\n    <div *ngFor=\"let item of _hours\"\n         class=\"ngx-md-clock-cell\"\n         [class.ngx-md-clock-cell-selected]=\"_selectedHour == item.value\"\n         [class.ngx-md-clock-cell-disabled]=\"!item.enabled\"\n         [style.top]=\"item.top+'%'\"\n         [style.left]=\"item.left+'%'\"\n         [style.fontSize]=\"item.fontSize\">{{ item.displayValue }}</div>\n  </div>\n  <div class=\"ngx-md-clock-minutes\" [class.active]=\"!_hourView\">\n    <div *ngFor=\"let item of _minutes\"\n         class=\"ngx-md-clock-cell\"\n         [class.ngx-md-clock-cell-selected]=\"_selectedMinute == item.value\"\n         [class.ngx-md-clock-cell-disabled]=\"!item.enabled\"\n         [style.top]=\"item.top+'%'\"\n         [style.left]=\"item.left+'%'\">{{ item.displayValue }}</div>\n  </div>\n</div>",
                host: {
                    'role': 'clock',
                    '(mousedown)': '_handleMousedown($event)',
                },
            },] },
];
/** @nocollapse */
NgxMaterialClock.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: DateLocale, },
    { type: DateUtil, },
]; };
NgxMaterialClock.propDecorators = {
    'activeDate': [{ type: Input },],
    'selected': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'startView': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'interval': [{ type: Input },],
    'twelvehour': [{ type: Input },],
    'selectedChange': [{ type: Output },],
    'activeDateChange': [{ type: Output },],
};
