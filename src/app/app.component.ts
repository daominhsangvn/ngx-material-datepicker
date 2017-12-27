import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { CalendarService } from "../../lib/datepicker/datepicker.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public frm: FormGroup;
  title = 'app works!';
  date: Date;
  today = new Date();

  constructor(private _fb: FormBuilder,
  private calendarService: CalendarService) {
    this.frm = this._fb.group({
      date: new FormControl(null, [
        Validators.required
      ]),
    });

    this.calendarService.firstWeekDay = 1;
  }

  public onDateChange(data) {
     // console.log(data);
  }
}
