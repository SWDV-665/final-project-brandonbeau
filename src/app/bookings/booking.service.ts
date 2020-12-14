import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay, timeout, share } from 'rxjs/operators';

import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([
    new Booking(
      'p4',
      '2',
      'acb',
      'Grand Canyon',
      'https://travel.usnews.com/dims4/USNEWS/7d95859/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/grand_canyon_main_2014_-_shutterstock-kojihirano_kUxSzuP.jpg',
      'Tekkie',
      'M',
      2,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
    )
  ]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private socialSharing:SocialSharing) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}