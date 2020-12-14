import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Subscription } from 'rxjs';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,  
    private loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    public toastController: ToastController
  ){}


  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

// cancel booking with id booking.Id
  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
   
//sharing Booked Items  
  async onShare( bookingTitle: string, slidingEl: IonItemSliding){
    console.log("Sharing booking", bookingTitle)
    const toast = await this.toastController.create({
      message: `Shared item: ${bookingTitle} .....`,
      duration: 3000
    });
    toast.present();

    let message = "Just Booked Our Trip To " + bookingTitle + "!";
    let subject = "Shared via Bucket List app";

    this.socialSharing.share(message, subject).then(() => {
     //Sharing via email is possible
     console.log("Shared successfully!");
    }).catch((error) => {
      console.error("Error while sharing", error);
    });
  }   

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
