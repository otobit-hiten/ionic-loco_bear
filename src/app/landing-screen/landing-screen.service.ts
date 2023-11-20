import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingScreenService {

  private apiUrl = 'https://activbitapi.otobit.com/Office/Game/RegisterDevices/GetDeviceDetail?UniqueId='; // replace with your API endpoint
  private getOrganisation = 'https://activbitapi.otobit.com/common/search/general/data?con=Organisation-Search&page=1&pageSize=50';
  private setOrganisation = 'https://activbitapi.otobit.com/Office/Game/RegisterDevices/RegisterDevice';
  private registerAndAllocate = 'http://192.168.1.52:8000/office/home/dashboard/Office-Home-Dashboard';
  constructor(private http: HttpClient) { }

  checkOrganisation(id:string): Observable<any> {
    return this.http.get(this.apiUrl+id);
  }
  getOrganisationData(): Observable<any>{
    return this.http.get(this.getOrganisation);
  }

  setOrganisationData(data:any){
    return this.http.put(this.setOrganisation,data)
  }

  registerAndAllocatePlayer(data:any){
    return this.http.put(this.registerAndAllocate,data)
  }

}
