import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// import { LSItems, LSItem } from './models';
import { IItems, IItem } from "@labshare/facility-base/models";

@Injectable()
export class CalendarApiService {
  constructor(private http: HttpClient) {}

  getView(api_url: string): Observable<{ items: IItems }> {
    return this.http.get<{ items: IItems }>(api_url);
  }

  getItem(api_url: string): Observable<{ item: IItem }> {
    return this.http.get<{ item: IItem }>(api_url);
  }

  update(api_url: string, data: any): Observable<{ item: IItem }> {
    return this.http.put<{ item: IItem }>(api_url, data);
  }

  delete(api_url: string): Observable<{ item: IItem }> {
    return this.http.delete<{ item: IItem }>(api_url);
  }

  getNew(api_url: string): Observable<{ item: IItem }> {
    return this.http.get<{ item: IItem }>(api_url);
  }

  create(api_url: string, data: any): Observable<{ item: IItem }> {
    return this.http.post<{ item: IItem }>(api_url, data);
  }
}
