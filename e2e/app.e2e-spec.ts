import { NgxMaterialDatepickerPage } from './app.po';

describe('ngx-material-datepicker App', () => {
  let page: NgxMaterialDatepickerPage;

  beforeEach(() => {
    page = new NgxMaterialDatepickerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
