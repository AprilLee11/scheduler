import { CalendarEvent, CalendarData } from './models';

export function createEvent<T extends CalendarEvent>(data: T) {
    const event = { id: data.id, title: data.title, start: new Date(data.start), end: new Date(data.end) };
    this.addEvent(event);
}

export function updateEvent<T extends CalendarEvent>(data: T) {
    // const event = this.getEventById(data.id);
    // event.setStart(new Date(data.start));
    // event.setEnd(new Date(data.end));
    // event.setProp('title', data.title);
}

export function deleteEvent<T extends CalendarEvent>(data: T) {
    const event = this.getEventById(data.id);
    event.remove();
}

export function renderCalendar<T extends CalendarData>(data: T) {
    this.setOption('events', data.events);
    this.setOption('resources', data.resources);
}

