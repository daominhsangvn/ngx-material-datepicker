import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdInputModule, MdRippleModule, MdButtonModule, MdIconModule, MdDialogModule } from '@angular/material';
import { DatePickerComponent } from './datepicker.component';
import { NgxMaterialClock } from './clock';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from './calendar.service';
import { DateLocale } from './date-locale';
import { DateUtil } from './date-util';
export * from './calendar.service';
var DatePickerModule = (function () {
    function DatePickerModule() {
    }
    return DatePickerModule;
}());
export { DatePickerModule };
DatePickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    DatePickerComponent,
                    CalendarComponent,
                    NgxMaterialClock
                ],
                imports: [
                    CommonModule,
                    MdInputModule,
                    MdRippleModule,
                    MdButtonModule,
                    MdIconModule,
                    MdDialogModule
                ],
                exports: [
                    DatePickerComponent,
                    NgxMaterialClock
                ],
                providers: [
                    CalendarService,
                    DateLocale,
                    DateUtil
                ],
                entryComponents: [
                    CalendarComponent
                ]
            },] },
];
/** @nocollapse */
DatePickerModule.ctorParameters = function () { return []; };
