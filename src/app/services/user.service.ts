import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getUsers() {
    this.loadingSubject.next(true);
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        this.loadingSubject.next(false);
        return data;
      })
    );
  }

  getUser(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  isLoading() {
    return this.loadingSubject.asObservable();
  }
}
