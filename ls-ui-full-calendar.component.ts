import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  AfterContentChecked,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'ls-ui-full-calendar',
  template: '',
  encapsulation: ViewEncapsulation.None
})
export class LsUiFullCalendarComponent implements AfterViewInit, AfterContentChecked, OnDestroy {

  @Input() options?: CalendarOptions;
  @Input() deepChangeDetection?: boolean;

  private calendar: Calendar;

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit() {
    const options = this.options || {};
    this.calendar = new Calendar(this.element.nativeElement, options);
    this.calendar.render();
  }

  ngAfterContentChecked() {
    if (this.calendar) {
      this.calendar.resumeRendering();
    }
  }

  ngOnDestroy() {
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }
  }

  public getApi(): Calendar {
    return this.calendar;
  }

}