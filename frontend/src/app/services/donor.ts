import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Donor {
  private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient){}
  completeProfile(dto:any){
    return this.http.post(`${this.apiUrl}/Donors/CompleteProfile`, dto);
  }
  getProfile(){
        return this.http.get(`${this.apiUrl}/Donors/GetDonor`)
  }
  getBloodRequests() {
  return this.http.get<any[]>(`${this.apiUrl}/BloodRequests/bloodrequests`);
}

createDonation(requestId: number) {
  return this.http.post(`${this.apiUrl}/Donors/CreateDonation`, { 
    requestId: requestId,
    notes: ''
  });
}

getMyDonations() {
  return this.http.get<any[]>(`${this.apiUrl}/Donors/MyDonations`);
}
  
}
