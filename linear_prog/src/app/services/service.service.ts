import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Line {
  m: number;
  b: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8000/api/plot-lines/'; // Ajuste o URL da sua API aqui

  constructor(private http: HttpClient) {}

  sendLines(lines: Line[]): Observable<any> {
    return this.http.post(this.apiUrl, { lines });
  }

  
}







