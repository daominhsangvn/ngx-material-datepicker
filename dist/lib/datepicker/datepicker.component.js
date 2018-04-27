import { Component, Output, Input, EventEmitter, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
//ngModel
var DATE_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return DatePickerComponent; }),
    multi: true
};
import { MdDialog } from '@angular/material';
import { CalendarComponent } from './calendar.component';
import { LANG_EN } from './lang-en';
var coerceBooleanProperty = function (value) {
    return value != null && "" + value !== 'false';
};
var DatePickerComponent = (function () {
    function DatePickerComponent(dialog, _element) {
        this._element = _element;
        this._format = 'MM/dd/yyyy';
        this._type = 'date';
        this._required = false;
        this._disabled = false;
        this.dateChange = new EventEmitter();
        this.hasArrow = false;
        this._MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this._DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // ngModel
        this._onValueTouched = function () {
        };
        this._onValueChange = function (_) {
        };
        this._validatorOnChange = function () {
        };
        this.dialog = dialog;
        this.dayNames = LANG_EN.weekDays;
        this.monthNames = LANG_EN.months;
        // if (this._control) {
        //   this._control.valueAccessor = this;
        // }
    }
    Object.defineProperty(DatePickerComponent.prototype, "required", {
        get: function () {
            return this._required;
        },
        set: function (value) {
            this._required = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value || 'date';
            if (this._input) {
                this._input.nativeElement.value = this.formatDate(this.dateVal);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "format", {
        get: function () {
            return this._format;
        },
        set: function (value) {
            if (this._format !== value) {
                this._format = value;
                if (this._input) {
                    this._input.nativeElement.value = this.formatDate(this.dateVal);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "date", {
        get: function () {
            return this.dateVal;
        },
        set: function (val) {
            var _this = this;
            this.dateVal = val;
            // Update ngModel
            this._onValueChange(val);
            setTimeout(function () {
                // trigger dateChange event
                _this.dateChange.emit(val);
            });
            // format date
            this.formattedDate = this.formatDate(val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatePickerComponent.prototype, "dates", {
        get: function () {
            return this.datesVal;
        },
        set: function (val) {
            var _this = this;
            if (val && val.length) {
                val.sort(function (a, b) {
                    return a.getTime() - b.getTime();
                });
            }
            this.datesVal = val;
            // Update ngModel
            this._onValueChange(val);
            setTimeout(function () {
                // trigger dateChange event
                _this.dateChange.emit(val);
            });
            // format date
            this.formattedDate = this.formatDates(val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(DatePickerComponent.prototype, "min", {
        /** The minimum valid date. */
        get: function () {
            return this._minDate;
        },
        set: function (value) {
            this._minDate = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "max", {
        /** The maximum valid date. */
        get: function () {
            return this._maxDate;
        },
        set: function (value) {
            this._maxDate = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    DatePickerComponent.prototype.ngOnInit = function () {
        // if (!this.date) {
        //   this.date = new Date();
        // }
    };
    DatePickerComponent.prototype._handleWindowResize = function (event) {
    };
    DatePickerComponent.prototype.openDialog = function () {
        var _this = this;
        var submit = new EventEmitter();
        var cancel = new EventEmitter();
        var ref = this.dialog.open(CalendarComponent, {
            data: {
                type: this.type,
                date: this.date,
                disable24Hr: this.disable24Hr,
                allowMultiDate: this.allowMultiDate,
                dates: this.dates || [],
                minDate: this._minDate,
                maxDate: this._maxDate,
                submit: submit,
                cancel: cancel
            }
        });
        // Workaround to update style of dialog which sits outside of the component
        var containerDiv = ref._overlayRef._pane.children[0];
        containerDiv.style['padding'] = '0';
        submit.subscribe(function (result) {
            if (_this.allowMultiDate) {
                _this.dates = result;
            }
            else {
                _this.date = result;
            }
            ref.close();
        });
        cancel.subscribe(function (result) {
            ref.close();
        });
    };
    DatePickerComponent.prototype._LZ = function (x) {
        return (x < 0 || x > 9 ? '' : '0') + x;
    };
    // http://mattkruse.com/javascript/date/source.html
    DatePickerComponent.prototype._formatDate = function (date, format) {
        format = format + '';
        var result = '';
        var i_format = 0;
        var c = '';
        var token = '';
        var y = date.getYear().toString();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var Ho = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
        // Convert real date parts into formatted versions
        var value = {};
        if (y.length < 4) {
            y = (y - 0 + 1900).toString();
        }
        value['y'] = '' + y;
        value['yyyy'] = y;
        value['yy'] = y.substring(2, 4);
        value['M'] = M;
        value['MM'] = this._LZ(M);
        value['MMM'] = this._MONTH_NAMES[M - 1];
        value['NNN'] = this._MONTH_NAMES[M + 11];
        value['d'] = d;
        value['dd'] = this._LZ(d);
        value['E'] = this._DAY_NAMES[E + 7];
        value['EE'] = this._DAY_NAMES[E];
        value['H'] = Ho;
        value['HH'] = this._LZ(Ho);
        if (Ho == 0) {
            value['h'] = 12;
        }
        else if (Ho > 12) {
            value['h'] = Ho - 12;
        }
        else {
            value['h'] = Ho;
        }
        value['hh'] = this._LZ(value['h']);
        if (Ho > 11) {
            value['K'] = Ho - 12;
        }
        else {
            value['K'] = Ho;
        }
        value['k'] = Ho + 1;
        value['KK'] = this._LZ(value['K']);
        value['kk'] = this._LZ(value['k']);
        if (Ho > 11) {
            value['a'] = 'PM';
        }
        else {
            value['a'] = 'AM';
        }
        value['m'] = m;
        value['mm'] = this._LZ(m);
        value['s'] = s;
        value['ss'] = this._LZ(s);
        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = '';
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result = result + value[token];
            }
            else {
                result = result + token;
            }
        }
        return result;
    };
    DatePickerComponent.prototype.formatDate = function (date) {
        if (!date) {
            return '';
        }
        if (typeof date === 'string') {
            try {
                date = new Date(date);
            }
            catch (e) {
            }
        }
        if (!date) {
            return '';
        }
        return this._formatDate(date, this._format);
    };
    DatePickerComponent.prototype.formatDates = function (dates) {
        var _this = this;
        return dates && dates.length ? dates.map(function (obj) { return _this.formatDate(obj); }).join(', ') : '';
    };
    Object.defineProperty(DatePickerComponent.prototype, "value", {
        // get accessor
        get: function () {
            console.log('get value');
            return this.allowMultiDate ? this.dates : this.date;
        },
        // set accessor including call the onchange callback
        set: function (v) {
            console.log('set value', v);
            this._onValueChange(v);
        },
        enumerable: true,
        configurable: true
    });
    ;
    // From ControlValueAccessor interface
    DatePickerComponent.prototype.registerOnChange = function (fn) {
        this._onValueChange = fn;
    };
    // From ControlValueAccessor interface
    DatePickerComponent.prototype.registerOnTouched = function (fn) {
        this._onValueTouched = fn;
    };
    // From ControlValueAccessor interface
    // ngModel change
    DatePickerComponent.prototype.writeValue = function (value) {
        if (this.allowMultiDate) {
            this.dates = value;
        }
        else {
            this.date = value;
        }
    };
    DatePickerComponent.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    return DatePickerComponent;
}());
export { DatePickerComponent };
DatePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-md-datepicker',
                template: "\n    <md-input-container flex (click)=\"openDialog()\">\n      <input mdInput\n             #input\n             (keydown)=\"$event.preventDefault()\"\n             [value]=\"formattedDate\"\n             placeholder=\"{{placeholder}}\"\n             [disabled]=\"disabled\">\n      <md-icon mdPrefix>date_range</md-icon>\n      <md-icon mdSuffix *ngIf=\"hasArrow\">arrow_drop_down</md-icon>\n    </md-input-container>\n  ",
                host: {
                    'role': 'datepicker',
                    '[class.ngx-md-datepicker-disabled]': 'disabled',
                    '[attr.aria-label]': 'placeholder',
                    '[attr.aria-required]': 'required.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-invalid]': '_control?.invalid || "false"',
                    '(window:resize)': '_handleWindowResize($event)'
                },
                exportAs: 'datePicker',
                providers: [DATE_PICKER_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
DatePickerComponent.ctorParameters = function () { return [
    { type: MdDialog, },
    { type: ElementRef, },
]; };
DatePickerComponent.propDecorators = {
    '_input': [{ type: ViewChild, args: ['input',] },],
    'required': [{ type: Input },],
    'disabled': [{ type: Input },],
    'dateChange': [{ type: Output },],
    'type': [{ type: Input },],
    'format': [{ type: Input },],
    'date': [{ type: Input },],
    'dates': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'disable24Hr': [{ type: Input },],
    'allowMultiDate': [{ type: Input },],
    'hasArrow': [{ type: Input },],
};
