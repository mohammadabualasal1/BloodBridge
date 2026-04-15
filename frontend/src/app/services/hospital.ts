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

  
}
