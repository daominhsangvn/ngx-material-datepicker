import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnInit,
  forwardRef,
  ElementRef,
  ViewChild,
  Self,
  Optional
} from "@angular/core";
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

//ngModel
const DATE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};
import { MatDialog } from "@angular/material";

import { CalendarComponent } from "./calendar.component";
import { Month } from "./month.model";
import { Weekday } from "./weekday.model";
import { LANG_EN } from "./lang-en";

let coerceBooleanProperty = (value: any): boolean => {
  return value != null && `${value}` !== "false";
};

@Component({
  selector: "ngx-datepicker",
  template: `
    <mat-form-field flex (click)="openDialog()">
      <input
        matInput
        #input
        (keydown)="$event.preventDefault()"
        [value]="formattedDate"
        placeholder="{{ placeholder }}"
        [disabled]="disabled"
      />
      <mat-icon matPrefix>date_range</mat-icon>
      <mat-icon matSuffix *ngIf="hasArrow">arrow_drop_down</mat-icon>
    </mat-form-field>
  `,
  host: {
    role: "datepicker",
    "[class.ngx-mat-datepicker-disabled]": "disabled",
    "[attr.aria-label]": "placeholder",
    "[attr.aria-required]": "required.toString()",
    "[attr.aria-disabled]": "disabled.toString()",
    "(window:resize)": "_handleWindowResize($event)"
  },
  exportAs: "datePicker",
  providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  private readonly dialog: MatDialog;
  private dateVal: Date;
  private _format = "MM/dd/yyyy";
  private _type: Type = "date";
  private _required: boolean = false;
  private _disabled: boolean = false;

  private datesVal: Date[];

  dayNames: Array<Weekday>;
  monthNames: Array<Month>;
  formattedDate: string;

  @ViewChild("input", { static: false }) _input: ElementRef;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value) {
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Output()
  public dateChange = new EventEmitter<Date | Date[]>();

  @Input()
  get type() {
    return this._type;
  }

  set type(value: Type) {
    this._type = value || "date";
    if (this._input) {
      this._input.nativeElement.value = this.formatDate(this.dateVal);
    }
  }

  @Input()
  get format(): string {
    return this._format;
  }

  set format(value) {
    if (this._format !== value) {
      this._format = value;
      if (this._input) {
        this._input.nativeElement.value = this.formatDate(this.dateVal);
      }
    }
  }

  @Input()
  get date(): Date {
    return this.dateVal;
  }

  set date(val: Date) {
    this.dateVal = val;
    // Update ngModel
    this._onValueChange(val);
    setTimeout(() => {
      // trigger dateChange event
      this.dateChange.emit(val);
    });
    // format date
    this.formattedDate = this.formatDate(val);
  }

  @Input()
  get dates(): Date[] {
    return this.datesVal;
  }

  set dates(val: Date[]) {
    if (val && val.length) {
      val.sort((a, b) => {
        return a.getTime() - b.getTime();
      });
    }
    this.datesVal = val;
    // Update ngModel
    this._onValueChange(val);
    setTimeout(() => {
      // trigger dateChange event
      this.dateChange.emit(val);
    });
    // format date
    this.formattedDate = this.formatDates(val);
  }

  /** The minimum valid date. */
  @Input()
  get min(): Date {
    return this._minDate;
  }

  set min(value: Date) {
    this._minDate = value;
    this._validatorOnChange();
  }

  _minDate: Date;

  /** The maximum valid date. */
  @Input()
  get max(): Date {
    return this._maxDate;
  }

  set max(value: Date) {
    this._maxDate = value;
    this._validatorOnChange();
  }

  _maxDate: Date;

  @Input() placeholder: string;

  @Input() disable24Hr: boolean;

  @Input() allowMultiDate: boolean;

  @Input() hasArrow: boolean = false;

  constructor(
    dialog: MatDialog,
    private _element: ElementRef
  ) /*@Self() @Optional() public _control: NgControl*/ {
    this.dialog = dialog;
    this.dayNames = LANG_EN.weekDays;
    this.monthNames = LANG_EN.months;
    // if (this._control) {
    //   this._control.valueAccessor = this;
    // }
  }

  ngOnInit() {
    // if (!this.date) {
    //   this.date = new Date();
    // }
  }

  _handleWindowResize(event: Event) {}

  openDialog() {
    const submit = new EventEmitter();

    const cancel = new EventEmitter();

    let ref = this.dialog.open(CalendarComponent, {
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
    let containerDiv = (<any>ref)._overlayRef._pane.children[0];
    containerDiv.style["padding"] = "0";

    submit.subscribe(result => {
      if (this.allowMultiDate) {
        this.dates = result;
      } else {
        this.date = result;
      }
      ref.close();
    });

    cancel.subscribe(result => {
      ref.close();
    });
  }

  private _MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  private _DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];

  private _LZ(x) {
    return (x < 0 || x > 9 ? "" : "0") + x;
  }

  // http://mattkruse.com/javascript/date/source.html
  private _formatDate(date, format) {
    format = format + "";
    let result = "";
    let i_format = 0;
    let c = "";
    let token = "";
    let y = date.getYear().toString();
    let M = date.getMonth() + 1;
    let d = date.getDate();
    let E = date.getDay();
    let Ho = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    // Convert real date parts into formatted versions
    let value = {};
    if (y.length < 4) {
      y = (y - 0 + 1900).toString();
    }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = this._LZ(M);
    value["MMM"] = this._MONTH_NAMES[M - 1];
    value["NNN"] = this._MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = this._LZ(d);
    value["E"] = this._DAY_NAMES[E + 7];
    value["EE"] = this._DAY_NAMES[E];
    value["H"] = Ho;
    value["HH"] = this._LZ(Ho);
    if (Ho == 0) {
      value["h"] = 12;
    } else if (Ho > 12) {
      value["h"] = Ho - 12;
    } else {
      value["h"] = Ho;
    }
    value["hh"] = this._LZ(value["h"]);
    if (Ho > 11) {
      value["K"] = Ho - 12;
    } else {
      value["K"] = Ho;
    }
    value["k"] = Ho + 1;
    value["KK"] = this._LZ(value["K"]);
    value["kk"] = this._LZ(value["k"]);
    if (Ho > 11) {
      value["a"] = "PM";
    } else {
      value["a"] = "AM";
    }
    value["m"] = m;
    value["mm"] = this._LZ(m);
    value["s"] = s;
    value["ss"] = this._LZ(s);
    while (i_format < format.length) {
      c = format.charAt(i_format);
      token = "";
      while (format.charAt(i_format) == c && i_format < format.length) {
        token += format.charAt(i_format++);
      }
      if (value[token] != null) {
        result = result + value[token];
      } else {
        result = result + token;
      }
    }
    return result;
  }

  private formatDate(date: Date): string {
    if (!date) {
      return "";
    }
    if (typeof date === "string") {
      try {
        date = new Date(date);
      } catch (e) {}
    }
    if (!date) {
      return "";
    }
    return this._formatDate(date, this._format);
  }

  private formatDates(dates: Date[]) {
    return dates && dates.length
      ? dates.map(obj => this.formatDate(obj)).join(", ")
      : "";
  }

  // ngModel
  private _onValueTouched = () => {};
  private _onValueChange = (_: any) => {};
  private _validatorOnChange = () => {};

  // get accessor
  public get value(): any {
    console.log("get value");
    return this.allowMultiDate ? this.dates : this.date;
  }

  // set accessor including call the onchange callback
  public set value(v: any) {
    console.log("set value", v);
    this._onValueChange(v);
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: any) => any): void {
    this._onValueChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => any): void {
    this._onValueTouched = fn;
  }

  // From ControlValueAccessor interface
  // ngModel change
  public writeValue(value: any) {
    if (this.allowMultiDate) {
      this.dates = value;
    } else {
      this.date = value;
    }
  }

  public registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }
}

export type Type = "date" | "time" | "datetime";
