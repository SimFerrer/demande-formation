import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  /**
 * Set a notification message
 * @param message - The message to display
 */
  setMessage(message: string): void {
    this.messageSubject.next(message);
  }

  /**
   * Clear the notification message
   */
  clearMessage(): void {
    this.messageSubject.next(null);
  }
}
