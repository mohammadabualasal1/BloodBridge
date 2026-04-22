import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Hospital {
    private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient){}
  completeProfile(dto:any){
    return this.http.post(`${this.apiUrl}/Hospitals/complete-profile`, dto);

  }
  GetAllHospitals(){
    return this.http.get(`${this.apiUrl}/Hospitals/GetAllHospitals`)
  }

verifyHospital(id:number){
      return this.http.put(`${this.apiUrl}/Hospitals/VerifyHospital/${id}`, {});
      

}
getMyRequests() {
  return this.http.get<any[]>(`${this.apiUrl}/BloodRequests/MyRequests`);
}

createRequest(dto: any) {
  return this.http.post(`${this.apiUrl}/BloodRequests/CreateRequest`, dto);
}

cancelRequest(id: number) {
  return this.http.put(`${this.apiUrl}/BloodRequests/cancelRequest/${id}`, {});
}
  getHospitalDonations() {
  return this.http.get<any[]>(`${this.apiUrl}/Donors/HospitalDonations`);
}

confirmDonation(id: number) {
  return this.http.put(`${this.apiUrl}/Donors/${id}/confirm`, {});
}

rejectDonation(id: number) {
  return this.http.put(`${this.apiUrl}/Donors/${id}/reject`, {});
}
}
