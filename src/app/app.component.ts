import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { CalendarService } from "@nois/ngx-datepicker";

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
  maxDate = new Date(2019, 10, 1);

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
