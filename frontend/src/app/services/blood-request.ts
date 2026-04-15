import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BloodRequest {
        private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient){}
  createRequest(dto:any){
     return this.http.post(`${this.apiUrl}/BloodRequests/CreateRequest`, dto);
  }
getAvailableRequests(){
    return this.http.get(`${this.apiUrl}/BloodRequests/bloodrequests`)
}
getMyRequests(){
   return this.http.get(`${this.apiUrl}/BloodRequests/MyRequests`)
}
cancelRequest(id:number){

      return this.http.put(`${this.apiUrl}/BloodRequests/cancelRequest/${id}`, {});
}


}
