import { EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
export declare class DatePickerComponent implements ControlValueAccessor, OnInit {
    private _element;
    private readonly dialog;
    private dateVal;
    private _format;
    private _type;
    private _required;
    private _disabled;
    dayNames: Array<Weekday>;
    monthNames: Array<Month>;
    formattedDate: string;
    _input: ElementRef;
    required: boolean;
    disabled: boolean;
    dateChange: EventEmitter<Date>;
    type: Type;
    format: string;
    date: Date;
    placeholder: string;
    constructor(dialog: MdDialog, _element: ElementRef);
    ngOnInit(): void;
    _handleWindowResize(event: Event): void;
    openDialog(): void;
    private _MONTH_NAMES;
    private _DAY_NAMES;
    private _LZ(x);
    private _formatDate(date, format);
    private formatDate(date);
    private _onValueTouched;
    private _onValueChange;
    value: Date;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    writeValue(value: Date): void;
}
export declare type Type = 'date' | 'time' | 'datetime';