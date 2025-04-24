// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Roles/GetAllRoles`);
  }
  createRole(body:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Roles/CreateRole`,body);
  }
  addPermissionsToRole(body:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Roles/AssignPermissionsToRole`,body);
  }
  assignOrAddAdminAndRoles(body:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Roles/AssignOrAddRoleToUser`, body);
  }
  getAllNotAssignedRoles(roleId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Roles/GetAllRolesNotAssigned/${roleId}`);
  }  
  UpdateRolesForAdmin(body:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/Roles/AssignOrAddRoleToUser`, body);
}
DeleteRolesFromAdmin(body:any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/Roles/DeleteUserRole`, body);
}
}
