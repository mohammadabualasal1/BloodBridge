import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class Notification {
        private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient){}
getNotifications(){
   return this.http.get(`${this.apiUrl}/notifications/GetNotifications`)
}
markAsRead(id:number){
  return this.http.put(`${this.apiUrl}/notifications/MarkAsRead/${id}`, {});
}
}
