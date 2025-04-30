import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OptimizationData } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/solve-optimization/'; 

  constructor(private http: HttpClient) {}

  sendOptData(optData: OptimizationData): Observable<any> {
    return this.http.post(this.apiUrl, optData);
  }
  
}







