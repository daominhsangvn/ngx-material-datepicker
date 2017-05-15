import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public frm: FormGroup;
  title = 'app works!';
  date: Date;

  constructor(private _fb: FormBuilder){
    this.frm = this._fb.group({
      date: new FormControl(null, [
        Validators.required
      ]),
    });
  }
}
