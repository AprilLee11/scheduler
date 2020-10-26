import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarStoreService<T> {

  private calendarEvent$: Subject<T>;

  constructor() {
    this.calendarEvent$ = new Subject<T>();
  }

  get calendarEventService$(): Subject<T> {
    return this.calendarEvent$;
  }
}