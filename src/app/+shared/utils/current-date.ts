import {formatDate } from '@angular/common';

export class CurrentDate {
  today= new Date();
  jstoday = '';
  getCurrentDate() {
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '');
    return this.jstoday;
  }
}
