import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NfeRefreshService {
  private readonly refreshNotasSubject = new Subject<void>();
  readonly refreshNotas$ = this.refreshNotasSubject.asObservable();

  requestNotasRefresh(): void {
    this.refreshNotasSubject.next();
  }
}
