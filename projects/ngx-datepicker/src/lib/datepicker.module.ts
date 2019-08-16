import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatRippleModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import { DatePickerComponent } from './datepicker.component';
import { NgxMaterialClock } from './clock';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from './calendar.service';
import { DateLocale } from './date-locale';
import { DateUtil } from './date-util';

export * from './calendar.service';
export * from './date-locale';
export * from './date-util';

@NgModule({
  declarations: [
    DatePickerComponent,
    CalendarComponent,
    NgxMaterialClock
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
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
})
export class NgxDatePickerModule {
}
