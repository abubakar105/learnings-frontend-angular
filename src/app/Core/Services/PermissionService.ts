// auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../enviornments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  getAllPermissions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/permissions/GetAllPermissions`);
  }
  createRole(body:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/permissions/CreatePermission`, body);
  }
//   assignOrAddAdminAndRoles(body:any): Observable<any> {
//     return this.http.post<any>(`${this.baseUrl}/Roles/AssignOrAddRoleToUser`, body);
//   }
//   getAllNotAssignedRoles(roleId: string): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/Roles/GetAllRolesNotAssigned/${roleId}`);
//   }  
//   UpdateRolesForAdmin(body:any): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}/Roles/AssignOrAddRoleToUser`, body);
// }
// DeleteRolesFromAdmin(body:any): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}/Roles/DeleteUserRole`, body);
// }
}
